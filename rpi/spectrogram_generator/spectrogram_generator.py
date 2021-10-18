"""
    This module is used to record sound from the mic
    and generate a spectrogram which will be sent to the 
    machine learning model
"""
import os
import wave
import pylab
import time


"""
    This method records 10 second clips 
    and saves them as a wav file
"""
def record_sound():
    filename = "sample.wav"
    record_sound_command="arecord --format=S16_LE --duration=10 --rate=16000 --file-type=wav /home/pi/Desktop/projects/msft-hackathon/sound_samples/"+ filename
    os.system(record_sound_command)

"""
    This method is used to generate a graph spectrogram 
    from a wav file
"""
def graph_spectrogram(wav_file):
    sound_info, frame_rate = get_wav_info(wav_file)
    pylab.figure(num=None, figsize=(19, 12))
    pylab.subplot(111)
    pylab.title('spectrogram of %r' % wav_file)
    pylab.specgram(sound_info, Fs=frame_rate)
    pylab.savefig('/home/pi/Desktop/projects/msft-hackathon/spectrogram_samples/spectrogram.png')
    print("Generated Spectrogram")

"""
    This method is used to obtain info from the wav file
"""
def get_wav_info(wav_file):
    wav = wave.open(wav_file, 'r')
    frames = wav.readframes(-1)
    sound_info = pylab.frombuffer(frames, 'int16')
    frame_rate = wav.getframerate()
    wav.close()
    return sound_info, frame_rate

while True:
    record_sound()
    graph_spectrogram('/home/pi/Desktop/projects/msft-hackathon/sound_samples/sample.wav')
    time.sleep(300) # we wait for 5 minutes before generating another sample