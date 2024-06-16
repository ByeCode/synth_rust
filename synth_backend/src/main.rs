use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use hound;
use rodio::{Decoder, OutputStream, source::Source};
use std::f32::consts::PI;
use std::fs::File;
use std::io::BufReader;
use std::sync::{Arc, Mutex};

const SAMPLE_RATE: u32 = 44100;
const AMPLITUDE: f32 = 0.5;

#[derive(Clone, Copy)]
enum Waveform {
    Sine,
    Square,
    Triangle,
    Sawtooth,
}

fn generate_sample(t: f32, frequency: f32, waveform: &Waveform) -> f32 {
    match waveform {
        Waveform::Sine => (2.0 * PI * frequency * t).sin(),
        Waveform::Square => if (2.0 * PI * frequency * t).sin() >= 0.0 { 1.0 } else { -1.0 },
        Waveform::Triangle => 2.0 * (2.0 * frequency * t).fract() - 1.0,
        Waveform::Sawtooth => 2.0 * (frequency * t).fract() - 1.0,
    }
}

fn low_pass_filter(input: f32, previous_output: f32, cutoff: f32, sample_rate: f32) -> f32 {
    let rc = 1.0 / (cutoff * 2.0 * PI);
    let alpha = sample_rate / (sample_rate + rc);
    alpha * input + (1.0 - alpha) * previous_output
}

struct ADSR {
    attack: f32,
    decay: f32,
    sustain: f32,
    release: f32,
}

fn apply_envelope(t: f32, duration: f32, adsr: &ADSR) -> f32 {
    if t < adsr.attack {
        t / adsr.attack
    } else if t < adsr.attack + adsr.decay {
        1.0 - (t - adsr.attack) / adsr.decay * (1.0 - adsr.sustain)
    } else if t < duration - adsr.release {
        adsr.sustain
    } else if t < duration {
        adsr.sustain * (1.0 - (t - (duration - adsr.release)) / adsr.release)
    } else {
        0.0
    }
}

async fn play_sound(data: web::Data<AppState>) -> impl Responder {
    let mut is_playing = data.is_playing.lock().unwrap();

    if *is_playing {
        return HttpResponse::TooManyRequests().body("Sound is already playing");
    }

    *is_playing = true;

    // Release the lock before playing sound to avoid holding the mutex for the entire duration
    drop(is_playing);

    let spec = hound::WavSpec {
        channels: 1,
        sample_rate: SAMPLE_RATE,
        bits_per_sample: 16,
        sample_format: hound::SampleFormat::Int,
    };

    let mut writer = hound::WavWriter::create("sounds/sine_wave.wav", spec).unwrap();
    let frequency = 440.0; // A4 note
    let duration = 2.0; // in seconds
    let waveform = Waveform::Sine; // Change to desired waveform
    let adsr = ADSR { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.5 };
    let mut previous_sample = 0.0;

    for t in 0..(SAMPLE_RATE as f32 * duration) as u32 {
        let time = t as f32 / SAMPLE_RATE as f32;
        let raw_sample = generate_sample(time, frequency, &waveform); // Pass reference to waveform
        let filtered_sample = low_pass_filter(raw_sample, previous_sample, 500.0, SAMPLE_RATE as f32);
        previous_sample = filtered_sample;
        let amplitude = apply_envelope(time, duration, &adsr);
        let sample = (AMPLITUDE * amplitude * filtered_sample * i16::MAX as f32) as i16;
        writer.write_sample(sample).unwrap();
    }
    writer.finalize().unwrap();

    // Play the generated WAV file
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let file = BufReader::new(File::open("sounds/sine_wave.wav").unwrap());
    let source = Decoder::new(file).unwrap().convert_samples();
    stream_handle.play_raw(source).unwrap();

    // Keep the program running long enough to play the sound
    std::thread::sleep(std::time::Duration::from_secs(duration as u64 + 1));

    // Acquire the lock again to update the is_playing status
    let mut is_playing = data.is_playing.lock().unwrap();
    *is_playing = false;

    HttpResponse::Ok().body("Playing sound")
}

struct AppState {
    is_playing: Mutex<bool>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        is_playing: Mutex::new(false),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .route("/play_sound", web::post().to(play_sound))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
