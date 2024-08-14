/**
 * Custom Video Player
 *
 * This module implements a feature-rich video player with custom controls,
 * including play/pause, volume control, seeking, fullscreen, picture-in-picture,
 * playback speed adjustment, and keyboard shortcuts.
 */

// ANCHOR Constants
const SKIP_TIME = 10
const VOLUME_HIGH = 1
const VOLUME_LOW = 0.3
const VOLUME_MUTED = 0

document.addEventListener("astro:page-load", initializeVideoPlayer)

function initializeVideoPlayer() {
	// ANCHOR Element Selection
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
	const bufferedBar = videoPlayer.querySelector(
		".buffered-progress-bar"
	) as HTMLDivElement

	// ANCHOR  Control Buttons
	const fastRewindButton = videoPlayer.querySelector(
		".fast-rewind"
	) as HTMLButtonElement
	const playPauseButton = videoPlayer.querySelector(
		".play-pause"
	) as HTMLButtonElement
	const fastForwardButton = videoPlayer.querySelector(
		".fast-forward"
	) as HTMLButtonElement
	const volumeButton = videoPlayer.querySelector(
		".volume"
	) as HTMLButtonElement
	const autoPlayButton = videoPlayer.querySelector(
		".auto-play-toggle"
	) as HTMLButtonElement
	const settingsButton = videoPlayer.querySelector(
		".settings-btn"
	) as HTMLButtonElement
	const pictureInPictureButton = videoPlayer.querySelector(
		".picture-in-picture"
	) as HTMLButtonElement
	const fullScreenButton = videoPlayer.querySelector(
		".full-screen"
	) as HTMLButtonElement

	// ANCHOR Other Elements
	const playIcon = videoPlayer.querySelector(".play") as SVGAElement
	const pauseIcon = videoPlayer.querySelector(".pause") as SVGAElement
	const volumeRange = videoPlayer.querySelector(
		"#volumeRange"
	) as HTMLInputElement
	const totalDuration = videoPlayer.querySelector(
		".duration"
	) as HTMLSpanElement
	const currentDuration = videoPlayer.querySelector(
		".current"
	) as HTMLSpanElement
	const settings = videoPlayer.querySelector("#settings") as HTMLDivElement
	const playbackSettings = videoPlayer.querySelector(
		".playback"
	) as HTMLDivElement

	const TOTAL_VIDEO_DURATION = mainVideo.duration

	// ANCHOR Utility Functions
	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = Math.floor(seconds % 60)
		return `${minutes}:${
			remainingSeconds < 10 ? "0" : ""
		}${remainingSeconds}`
	}

	// ANCHOR Core Functions
	function updateBufferedProgress() {
		if (mainVideo.buffered.length > 0) {
			const buffered = mainVideo.buffered
			const bufferedEnd = buffered.end(buffered.length - 1)
			const totalDuration = mainVideo.duration
			const bufferedWidth = (bufferedEnd / totalDuration) * 100
			bufferedBar.style.width = `${bufferedWidth}%`
		}
	}

	let hideTimeout: number
	function showControls() {
		clearTimeout(hideTimeout)
		controls.setAttribute("aria-controls-active", "true")
	}

	function hideControls() {
		hideTimeout = window.setTimeout(() => {
			controls.removeAttribute("aria-controls-active")
		}, 2000)
	}

	function playPauseVideo() {
		mainVideo.paused ? mainVideo.play() : mainVideo.pause()
	}

	function fastRewind() {
		mainVideo.currentTime = Math.max(mainVideo.currentTime - SKIP_TIME, 0)
	}

	function fastForward() {
		mainVideo.currentTime = Math.min(
			mainVideo.currentTime + SKIP_TIME,
			mainVideo.duration
		)
	}

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

	function setVolume(level: number) {
		mainVideo.volume = level
		updateVolumeIcon(level)
	}

	function toggleFullScreen(element: HTMLElement) {
		const isFullScreen =
			fullScreenButton.getAttribute("aria-maximized") === "true"

		if (!isFullScreen && !document.fullscreenElement) {
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

	function setPlaybackSpeed(
		videoElement: HTMLVideoElement,
		playbackContainer: HTMLElement
	) {
		const speedOptions =
			playbackContainer.querySelectorAll("li[data-speed]")

		speedOptions.forEach((option) => {
			option.addEventListener("click", () => {
				const selectedSpeed = parseFloat(
					option.getAttribute("data-speed") || "1"
				)
				videoElement.playbackRate = selectedSpeed
				speedOptions.forEach((opt) =>
					opt.removeAttribute("active-speed")
				)
				option.setAttribute("active-speed", "true")
			})
		})
	}

	// ANCHOR Keyboard Event Handler
	function handleKeyBoardEvents(event: KeyboardEvent) {
		const tagName = document.activeElement?.tagName.toLowerCase()

		if (event.target == document.body) return
		if (tagName === "input") return

		switch (event.key) {
			case " ":
				if (tagName === "button") return
			case "k":
				playPauseVideo()
				break
			case "ArrowLeft":
			case "j":
				fastRewind()
				break
			case "ArrowRight":
			case "l":
				fastForward()
				break
			case "m":
				volumeButton.click()
				break
			case "ArrowUp":
				const newVolumeUp = Math.min(mainVideo.volume + 0.1, 1)
				setVolume(newVolumeUp)
				volumeRange.value = (newVolumeUp * 100).toString()
				break
			case "ArrowDown":
				const newVolumeDown = Math.max(mainVideo.volume - 0.1, 0)
				setVolume(newVolumeDown)
				volumeRange.value = (newVolumeDown * 100).toString()
				break
			case "f":
				toggleFullScreen(videoPlayer)
				break
		}
	}

	// ANCHOR Event Listeners
	// ======================= GENERAL LISTENERS ==========================
	videoPlayer.addEventListener("contextmenu", (evt) => evt.preventDefault())
	mainVideo.addEventListener("progress", updateBufferedProgress)

	if (mainVideo.readyState >= 1) {
		updateVideoDuration()
	} else {
		mainVideo.addEventListener("loadedmetadata", updateVideoDuration)
	}

	// ======================= PLAYBACK CONTROL ==========================
	mainVideo.addEventListener("timeupdate", () => {
		let currentTime = mainVideo.currentTime
		currentDuration.textContent = formatTime(currentTime)
		let progressWidth = (currentTime / TOTAL_VIDEO_DURATION) * 100
		progressBar.style.width = `${progressWidth}%`
	})

	mainVideo.addEventListener("ended", () => {
		if (autoPlayButton.getAttribute("aria-checked") === "true") {
			playPauseVideo()
		}
	})

	playPauseButton.addEventListener("click", playPauseVideo)

	mainVideo.addEventListener("play", () => {
		videoPlayer.setAttribute("aria-paused", "false")
		playIcon.classList.add("hidden")
		pauseIcon.classList.remove("hidden")
		hideControls()
	})

	mainVideo.addEventListener("pause", () => {
		videoPlayer.setAttribute("aria-paused", "true")
		playIcon.classList.remove("hidden")
		pauseIcon.classList.add("hidden")
		showControls()
	})

	fastRewindButton.addEventListener("click", fastRewind)
	fastForwardButton.addEventListener("click", fastForward)

	// ======================= PROGRESS AND SEEKING ==========================
	progressArea.addEventListener("click", (evt) => {
		const progressAreaWidth = progressArea.clientWidth
		const clickOffSetX = evt.offsetX
		mainVideo.currentTime =
			(clickOffSetX / progressAreaWidth) * TOTAL_VIDEO_DURATION
	})

	progressArea.addEventListener("mousemove", (evt) => {
		const progressAreaWidth = (evt.currentTarget as HTMLElement).clientWidth
		const offsetX =
			evt.clientX -
			(evt.currentTarget as HTMLElement).getBoundingClientRect().left
		let percentage = offsetX / progressAreaWidth
		let progressTime = mainVideo.duration * percentage
		progressTime = Math.max(0, Math.min(progressTime, mainVideo.duration))
		const formattedTime = formatTime(progressTime)
		progressAreaTime.textContent = formattedTime
		let tooltipX = Math.max(offsetX, progressAreaTime.clientWidth / 2)
		tooltipX = Math.min(
			tooltipX,
			progressAreaWidth - progressAreaTime.clientWidth / 2
		)
		progressAreaTime.style.left = `${
			tooltipX - progressAreaTime.clientWidth / 2
		}px`
		progressAreaTime.style.display = "block"
	})

	progressArea.addEventListener("mouseleave", () => {
		progressAreaTime.style.display = "none"
	})

	// ======================= VOLUME CONTROL ==========================
	volumeRange.addEventListener("input", () => {
		setVolume(parseFloat(volumeRange.value) / 100)
	})

	volumeButton.addEventListener("click", () => {
		if (mainVideo.volume === VOLUME_MUTED) {
			setVolume(VOLUME_HIGH)
			volumeRange.value = (VOLUME_HIGH * 100).toString()
		} else {
			setVolume(VOLUME_MUTED)
			volumeRange.value = "0"
		}
	})

	setVolume(VOLUME_HIGH)

	// ======================= AUTOPLAY TOGGLE ==========================
	autoPlayButton.addEventListener("click", () => {
		const isChecked = autoPlayButton.getAttribute("aria-checked") === "true"
		autoPlayButton.setAttribute("aria-checked", (!isChecked).toString())
		autoPlayButton.title = isChecked ? "Autoplay is off" : "Autoplay is on"
	})

	// ======================= PICTURE-IN-PICTURE ==========================
	pictureInPictureButton.addEventListener("click", async () => {
		try {
			if (navigator.userAgent.toLowerCase().includes("firefox")) {
				alert(
					"To use Picture-in-Picture in Firefox, hover over the video and click the Picture-in-Picture button."
				)
			} else if (
				document.pictureInPictureEnabled &&
				mainVideo instanceof HTMLVideoElement
			) {
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

	// ======================= FULLSCREEN CONTROL ==========================
	fullScreenButton.addEventListener("click", () =>
		toggleFullScreen(videoPlayer)
	)

	// ======================= SETTINGS CONTROL ==========================
	settingsButton.addEventListener("click", () => {
		const isSettingsOpened =
			settingsButton.getAttribute("aria-settings-opened") === "true"
		const newSettingsState = (!isSettingsOpened).toString()
		settings.setAttribute("aria-settings-opened", newSettingsState)
		settingsButton.setAttribute("aria-settings-opened", newSettingsState)
	})

	// Enable Playback Settings
	if (mainVideo && playbackSettings) {
		setPlaybackSpeed(mainVideo, playbackSettings)
	}

	// ======================= CONTROL VISIBILITY ==========================
	videoPlayer.addEventListener("mouseover", showControls)
	videoPlayer.addEventListener("mouseleave", () => {
		const isPaused = videoPlayer.getAttribute("aria-paused") === "true"
		const isSettingsOpened =
			settingsButton.getAttribute("aria-settings-opened") === "true"
		if (!isPaused && !isSettingsOpened) hideControls()
	})

	// ======================= KEYBOARD CONTROLS ==========================
	document.addEventListener("keydown", handleKeyBoardEvents)
}
