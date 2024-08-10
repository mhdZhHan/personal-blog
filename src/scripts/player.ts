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
	// ============================================

	function playVideo() {
		playIcon.classList.toggle("hidden")
		pauseIcon.classList.toggle("hidden")
	}

	playPauseButton.addEventListener("click", playVideo)
})
