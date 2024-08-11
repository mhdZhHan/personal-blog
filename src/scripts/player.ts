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
	const autoPlayButton = videoPlayer.querySelector(
		".auto-play-toggle"
	) as HTMLButtonElement
	// buttons
	const settingsButton = videoPlayer.querySelector(
		".settings-btn"
	) as HTMLButtonElement
	const pictureInPictureButton = videoPlayer.querySelector(
		".picture-in-picture"
	) as HTMLButtonElement
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

	const VOLUME_HIGH = 1 // full volume
	const VOLUME_LOW = 0.3
	const VOLUME_MUTED = 0

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

	// Function to handle fast rewind
	function fastRewind() {
		mainVideo.currentTime = Math.max(mainVideo.currentTime - SKIP_TIME, 0)
	}

	// Function to handle fast forward
	function fastForward() {
		mainVideo.currentTime = Math.min(
			mainVideo.currentTime + SKIP_TIME,
			mainVideo.duration
		)
	}

	// Load video duration and setting total video duration
	function updateVideoDuration() {
		totalDuration.textContent = formatTime(TOTAL_VIDEO_DURATION)
	}

	function updateVolumeIcon(volume: number) {
		if (volume === VOLUME_MUTED) {
			volumeButton.dataset.volumeLevel = "muted"
		} else if (volume <= VOLUME_LOW) {
			volumeButton.dataset.volumeLevel = "low"
		} else {
			volumeButton.dataset.volumeLevel = "high"
		}
	}

	// Function to set the volume level
	function setVolume(level: number) {
		mainVideo.volume = level
		updateVolumeIcon(level)
	}

	// Function to toggle fullscreen
	function toggleFullScreen(element: HTMLElement) {
		const isFullScreen =
			autoPlayButton.getAttribute("aria-maximized") === "false"

		if (!isFullScreen && !document.fullscreenElement) {
			// If not in full-screen, request full-screen
			if (element.requestFullscreen) {
				element.requestFullscreen()
			} else if ((element as any).mozRequestFullScreen) {
				;(element as any).mozRequestFullScreen()
			} else if ((element as any).webkitRequestFullscreen) {
				;(element as any).webkitRequestFullscreen()
			} else if ((element as any).msRequestFullscreen) {
				;(element as any).msRequestFullscreen()
			}

			fullScreenButton.setAttribute("aria-maximized", "true")
		} else {
			// If already in full-screen, exit full-screen mode
			if (document.exitFullscreen) {
				document.exitFullscreen()
			} else if ((document as any).mozCancelFullScreen) {
				;(document as any).mozCancelFullScreen()
			} else if ((document as any).webkitExitFullscreen) {
				;(document as any).webkitExitFullscreen()
			} else if ((document as any).msExitFullscreen) {
				;(document as any).msExitFullscreen()
			}

			fullScreenButton.setAttribute("aria-maximized", "false")
		}
	}

	/**
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 */

	// ANCHOR ========== KEYBOARD EVENTS ===================================
	function handleKeyBoardEvents(event: KeyboardEvent) {
		if (event.target == document.body) return

		switch (event.key) {
			case " ":
			case "k":
				palyPauseVideo()
				break
			case "ArrowLeft": // Fast rewind
			case "j":
				fastRewind()
				break
			case "ArrowRight": // Fast forward
			case "l":
				fastForward()
				break
			case "m": // Mute/unmute
				volumeButton.click()
				break
			case "ArrowUp": // Increase volume
				const newVolumeUp = Math.min(mainVideo.volume + 0.1, 1)
				setVolume(newVolumeUp)
				volumeRange.value = (newVolumeUp * 100).toString()
				break
			case "ArrowDown": // Decrease volume
				const newVolumeDown = Math.max(mainVideo.volume - 0.1, 0)
				setVolume(newVolumeDown)
				volumeRange.value = (newVolumeDown * 100).toString()
				break
			case "f": // Toggle fullscreen
				toggleFullScreen(videoPlayer)
				break
		}
	}

	document.addEventListener("keydown", handleKeyBoardEvents)

	/**
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 */

	// ANCHOR ========== EVENT LISTENERS ====================================

	// Prevent default controls
	videoPlayer.addEventListener("contextmenu", (evt) => {
		evt.preventDefault()
	})

	// Check if the metadata is already loaded (this way may because of `astro:page-load`)
	if (mainVideo.readyState >= 1) {
		// HAVE_METADATA (1)
		updateVideoDuration()
	} else {
		// Add event listener to handle when metadata is loaded
		mainVideo.addEventListener("loadedmetadata", updateVideoDuration)
	}

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

	mainVideo.addEventListener("ended", () => {
		if (autoPlayButton.getAttribute("aria-checked") === "true") {
			palyPauseVideo()
		}
	})

	// Video playing and pausing
	playPauseButton.addEventListener("click", palyPauseVideo)

	// Fast Rewind
	fastRewindButton.addEventListener("click", fastRewind)

	// Fast Forward
	fastForwardButton.addEventListener("click", fastForward)

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

	/*
	 * ANCHOR ========== DISPLAY PROGRESS TIME ON MOUSE MOVE  ====================
	 *
	 * - Calculates the current time based on the cursor position relative to the progress area.
	 * - Updates the displayed time and adjusts the position of the time indicator.
	 * - The display is shown while the cursor is within the progress area.
	 *
	 * ========================================================================
	 */
	progressArea.addEventListener("mousemove", (evt) => {
		const progressAreaWidth = (evt.currentTarget as HTMLElement).clientWidth
		const offsetX =
			evt.clientX -
			(evt.currentTarget as HTMLElement).getBoundingClientRect().left

		// Calculate the progress time based on the offset
		const percentage = offsetX / progressAreaWidth
		const progressTime = mainVideo.duration * percentage

		// Format the progress time in mm:ss
		const formattedTime = formatTime(progressTime)

		progressAreaTime.textContent = formattedTime

		progressAreaTime.style.setProperty("--x", `${offsetX}px`)
		progressAreaTime.style.display = "block"
	})

	// HIDE PROGRESS TIME ON MOUSE LEAVE
	progressArea.addEventListener("mouseleave", (evt) => {
		progressAreaTime.style.display = "none"
	})

	// ANCHOR ======================= VOLUME ===================================
	// Volume range input change
	volumeRange.addEventListener("input", () => {
		setVolume(parseFloat(volumeRange.value) / 100)
	})

	// Volume button click (toggle mute/unmute)
	volumeButton.addEventListener("click", () => {
		if (mainVideo.volume === VOLUME_MUTED) {
			setVolume(VOLUME_HIGH)
			volumeRange.value = (VOLUME_HIGH * 100).toString()
		} else {
			setVolume(VOLUME_MUTED)
			volumeRange.value = "0"
		}
	})

	// Initialize volume on page load
	setVolume(VOLUME_HIGH)
	// ==========================================================================

	// ANCHOR ======================= AUTO PLAY TOGGLE ==========================
	autoPlayButton.addEventListener("click", () => {
		const isChecked = autoPlayButton.getAttribute("aria-checked") === "true"

		autoPlayButton.setAttribute("aria-checked", (!isChecked).toString())

		if (!isChecked) {
			autoPlayButton.title = "Autoplay is on"
		} else {
			autoPlayButton.title = "Autoplay is off"
		}
	})
	// ==========================================================================

	// ANCHOR ======================= PICTURE IN PICTURE ========================
	pictureInPictureButton.addEventListener("click", async () => {
		try {
			// Detect if the user is using Firefox
			if (navigator.userAgent.toLowerCase().includes("firefox")) {
				alert(
					"To use Picture-in-Picture in Firefox, hover over the video and click the Picture-in-Picture button."
				)
			} else if (
				document.pictureInPictureEnabled &&
				mainVideo instanceof HTMLVideoElement
			) {
				// For other browsers that support the method
				await mainVideo.requestPictureInPicture()
			} else {
				console.log(
					"Picture-in-Picture is not supported by this browser."
				)
			}
		} catch (error) {
			console.error("Failed to enter Picture-in-Picture mode:", error)
		}
	})

	// ==========================================================================

	// ANCHOR ======================= FULL SCREEN ========================
	fullScreenButton.addEventListener("click", () =>
		toggleFullScreen(videoPlayer)
	)
	// ==========================================================================

	/**
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 * ********************************************************************
	 */
})
