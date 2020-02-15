export default function scrollToTop() {
	if (document && document.body && document.documentElement)
		document.body.scrollTop = document.documentElement.scrollTop = 0;
}
