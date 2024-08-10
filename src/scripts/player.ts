document.addEventListener("astro:page-load", () => {
	const videoPlayer = document.querySelector("#videoPlayer") as HTMLDivElement

	const mainVideo = videoPlayer.querySelector(
		"#mainVideo"
	) as HTMLVideoElement
	const progressAreaTime = videoPlayer.querySelector(
		".progressAreaTime"
	) as HTMLDivElement
	const controls = videoPlayer.querySelector(".controls") as HTMLDivElement
	const progressArea = videoPlayer.querySelector(
		".progress-area"
	) as HTMLDivElement
	const progressBar = videoPlayer.querySelector(
		".progress-bar"
	) as HTMLDivElement

	// ======== LEFT CONTROLS ========
	// buttons
	const fastRewindButton = videoPlayer.querySelector(
		".fast-rewind"
	) as HTMLButtonElement
	const playPauseButton = videoPlayer.querySelector(
		".play-pause"
	) as HTMLButtonElement

	const playIcon = videoPlayer.querySelector(".play") as SVGAElement
	const pauseIcon = videoPlayer.querySelector(".pause") as SVGAElement

	const fastForwardButton = videoPlayer.querySelector(
		".fast-forward"
	) as HTMLButtonElement
	const volumeButton = videoPlayer.querySelector(
		".volume"
	) as HTMLButtonElement

	// volume range
	const volumeRange = videoPlayer.querySelector(
		"#volumeRange"
	) as HTMLInputElement

	// duration text
	const totalDuration = videoPlayer.querySelector(
		".duration"
	) as HTMLSpanElement
	const currentDuration = videoPlayer.querySelector(
		".current"
	) as HTMLSpanElement
	// ============================================

	// ======== RIGHT CONTROLS ========
	// toggle
	const autoPlay = videoPlayer.querySelector(
		".auto-play-toggle"
	) as HTMLButtonElement
	// buttons
	const settingsButton = videoPlayer.querySelector(
		".settings-btn"
	) as HTMLButtonElement
	const pictureInPictureButton = videoPlayer.querySelector(
		".picture-in-picture"
	)
	const fullScreenButton = videoPlayer.querySelector(
		".full-screen"
	) as HTMLButtonElement
	// ============================================

	// ======== SETTINGS ========
	const settings = videoPlayer.querySelector("#settings") as HTMLDivElement
	const playback = videoPlayer.querySelector(".playback") as HTMLDivElement

	/**
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 */

	// ANCHOR ========== CONSTANTS =======================================

	const SKIP_TIME = 10
	const TOTAL_VIDEO_DURATION = mainVideo.duration

	// ANCHOR ========== UTIL FUNCTIONS =======================================

	// Utility function to format the time in mm:ss
	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = Math.floor(seconds % 60)
		return `${minutes}:${
			remainingSeconds < 10 ? "0" : ""
		}${remainingSeconds}`
	}

	// ANCHOR ========== CORE FUNCTIONS =======================================

	// Control video play and pause
	function palyPauseVideo() {
		if (mainVideo.paused) {
			mainVideo.play()

			playIcon.classList.add("hidden")
			pauseIcon.classList.remove("hidden")
		} else {
			mainVideo.pause()

			playIcon.classList.remove("hidden")
			pauseIcon.classList.add("hidden")
		}
	}

	// Load video duration and setting total video duration
	function updateVideoDuration() {
		totalDuration.textContent = formatTime(TOTAL_VIDEO_DURATION)
	}

	/**
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 */

	// ANCHOR ========== EVENT LISTENERS ====================================

	// Check if the metadata is already loaded (this way may because of `astro:page-load`)
	if (mainVideo.readyState >= 1) {
		// HAVE_METADATA (1)
		updateVideoDuration()
	} else {
		// Add event listener to handle when metadata is loaded
		mainVideo.addEventListener("loadedmetadata", updateVideoDuration)
	}

	// Prevent default controls
	videoPlayer.addEventListener("contextmenu", (evt) => {
		evt.preventDefault()
	})

	// Video playing and pausing
	playPauseButton.addEventListener("click", palyPauseVideo)

	// Fast Rewind
	fastRewindButton.addEventListener("click", () => {
		mainVideo.currentTime = Math.max(mainVideo.currentTime - SKIP_TIME, 0)
	})

	// Fast Forward
	fastForwardButton.addEventListener("click", () => {
		mainVideo.currentTime = Math.min(
			mainVideo.currentTime + SKIP_TIME,
			mainVideo.duration
		)
	})

	/**
	 * Updates the current playback time and adjusts the progress bar width
	 * based on the current time of the video.
	 */
	mainVideo.addEventListener("timeupdate", () => {
		let currentTime = mainVideo.currentTime
		currentDuration.textContent = formatTime(currentTime)

		let progressWidth = (currentTime / TOTAL_VIDEO_DURATION) * 100
		progressBar.style.width = `${progressWidth}%`
	})

	/**
	 * ANCHOR ========== SEEK VIDEO ON CLICK ===================================
	 *
	 * Allows users to seek to a specific time in the video by clicking on the
	 * progress area. This listener calculates the click position relative to the
	 * width of the progress area and adjusts the video playback time accordingly.
	 *
	 * ========================================================================
	 */
	progressArea.addEventListener("click", (evt) => {
		const progressAreaWidth = progressArea.clientWidth
		const clickOffSetX = evt.offsetX

		mainVideo.currentTime =
			(clickOffSetX / progressAreaWidth) * TOTAL_VIDEO_DURATION
	})

	/**
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 */
})
