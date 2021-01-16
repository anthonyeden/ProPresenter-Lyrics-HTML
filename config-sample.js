var config = {
    "IPAddress": "127.0.0.1",
    "IPPort": 50001,
    "Password": "password",

	// These details are optional, but will be used in the case the 1st ProPresenter connection fails
    "BackupIPAddress": "127.0.0.1",
    "BackupIPPort": 50001,
    "BackupPassword": "password",

    "SplitLines": null, // Set this to a string to allow multi-lingual slide splitting
    "SplitLinesNum": 0, // Which version of the slide do you want to use? (hint: starts at zero)

    "ClockLocale": "en-US", // Local to use for displaying the clock

    // Un-implemented settings:

    //"MergeLines": false,
    //"MergeLinesMin": 4,
    //"MergeLinesJoinChar": ",",

    //"TimerLabels": ["Elapsed Time", "Video Countdown"]
}
