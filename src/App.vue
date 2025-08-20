<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'
export default {
	watch: {
		$route(to) {
			let title = to.meta.title
			if (!title) {
				title = to.query.title
			}
			if (to.matched.length > 1) {
				this.$store.commit('worktabRoute', {
					to: {
						name: to.name,
						title: title,
						path: to.fullPath
					}
				})
			}
		}
	},
	created() {
		this.changeColor()
	},
	methods: {
		changeColor() {
			let color = localStorage.getItem('color') || '#3a6cfa'
			if (color) {
				var options = {
					newColors: [...forElementUI.getElementUISeries(color)]
				}
				client.changer.changeColor(options, Promise).then(() => {})
			}
		}
	}
}
</script>
