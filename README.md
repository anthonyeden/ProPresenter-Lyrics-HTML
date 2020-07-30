![ProPresenter Stage Display & Lower Thirds HTML](https://mediarealm.com.au/wp-content/uploads/2020/01/ProPresenter-Stage-Display-HTML.png)

# ProPresenter Lyrics HTML

This repository contains a bunch of different ways to display lyrics - including Stage Display, and Lower Thirds. Lyrics come from ProPresenter via WebSockets, and can be rendered in web browsers that support Alpha Channel output (e.g. CasparCG), or displayed in any basic web browser (e.g. on a Raspberry Pi for a Stage Display).

This project has been updated to work with the latest version of ProPresenter. It is a replacement for https://github.com/anthonyeden/ProPresenter-Lyrics-HTML.

These setup instructions are a work-in-progress.

# Installing

1. Download this repository to your machine
2. Copy config-sample.js to config.js
3. Edit config.js in a text editor and set the IP Address, Port Number, and Password for your ProPresenter Stage Display computer (found in Preferences > Network of your ProPresenter PC).
3. Run one of the HTML files in a web browser

# Installation - Raspberry Pi

1. [Download and install Raspbian Desktop](https://www.raspberrypi.org/downloads/raspbian/) on your Raspberry Pi
2. Connect your WiFi or Ethernet
3. Open Terminal and run the following commands:

```
sudo apt-get install git
git clone https://github.com/anthonyeden/ProPresenter-Lyrics-HTML/
echo "@/home/pi/ProPresenter-Lyrics-HTML/start.sh" >> .config/lxsession/LXDE-pi/autostart
cp ProPresenter-Lyrics-HTML/config-sample.js ProPresenter-Lyrics-HTML/config.js
``` 

4. To edit the configuration, run this command:

```
nano ProPresenter-Lyrics-HTML/config.js
```

  Ensure you update the IP Address, Port Number & Password for your ProPresenter computer. On your ProPresenter computer, this can be setup in _Preferences > Network_ of your ProPresenter PC.
  
  Press Ctrl + X to close the Nano text editor.
  
6. The stage display should now load automatically in a Chromium web browser whenever you login to your Raspberry Pi.

## Upgrading - Raspberry Pi

1. Open Terminal and run the following commands:

```
cd ~/ProPresenter-Lyrics-HTML
git pull
```

## Disabling the Screensaver on a Raspberry Pi

If you run this application on a Raspberry Pi, you're going to need to disable the screensaver. There's a couple of ways to do this, depending on your version of Raspbian:

### Method 1

1. Install XScreensaver, by using the following terminal command:

```
sudo apt-get install xscreensaver
```

2. Open the menu in the top-left corner of your desktop.
3. Go to Preference > Screensaver.
4. Select "Disable Screensaver"
5. Reboot your Pi for the changes to work


### Method 2

```
sudo nano /etc/lightdm/lightdm.conf
```

Find (Ctrl + W):

```
#xserver-command=X
```

Change it to:

```
xserver-command=X -s 0 dpms
```

### Method 3

Add these lines to /etc/xdg/lxsession/LXDE-pi/autostart:

```
@xset s noblank 
@xset s off 
@xset -dpms
```