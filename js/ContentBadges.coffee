class ContentBadges extends Class
	constructor: ->
		@loaded = true
		@need_update = false

	fncs: {}

	section: (name,ar) =>
		if ar.filter(((e) => !e.properties.classes.invisible)).length
			h("div.setting"+name, [
				h("h2.sep",name)
				for e in ar
					e
				h("br",name)
			])

	renderCheck: (key,name,desc="",attrs={}) =>
		@fncs[key]?=(item) =>
			if attrs.disabled_by and Page.local_storage.settings[attrs.disabled_by]
				return false
			Page.local_storage.settings[key] = not Page.local_storage.settings[key]
			if attrs.postRun
				attrs.postRun(Page.local_storage.settings[key])
			document.body.className = "loaded"+Page.otherClasses()
			Page.projector.scheduleRender()
			Page.saveLocalStorage()
			Page.content.need_update = true
			return false

		h("div.checkbox.setting", {classes: {invisible: (if not @search or (name.toLowerCase().indexOf(@search.toLowerCase())!=-1) then false else true),checked: Page.local_storage.settings[key], disabled: attrs.disabled_by and Page.local_storage.settings[attrs.disabled_by]}, onclick: @fncs[key]},
			h("div.checkbox-skin"),
			h("div.title", name)
			h("br",key)
		)

	render: =>
		window.otherPageBackground()

		if @loaded and not Page.on_loaded.resolved then Page.on_loaded.resolve()
		if @need_update
			@log "Updating"
			@need_update = false
			Page.changeTitle "Badges"

		h("div#Content.center", [
			if Page.local_storage_loaded
				h("div.post.settings",{style:"border-radius: 16px"},[
					h("br","top") #make it "unique"
					h("div",{style:"display:flex;"},[
						h("h1",{style:"margin:6px;"},"Badges")
					])
					h("h2","Show to other users in your profile what you're doing for make Peeper better!")
					h("h4","What are Open Badges?")
					h("span","'Get recognition for learning that happens anywhere. Then share it on the places that matter. A digital badge is an online representation of a skill you've earned'. Know more in ")
					h("a",{href:"https://openbadges.org/"},"the Open Badges site")
					h("span",".")
					h("br")
					h("img",{src:"img/issuer-insignia-banner1.png",align:"middle"})
					h("h4","How to earn my badges in Peeper?")
					h("span","Complete a specific task/achievement. For reference, see the ")
					h("a",{href:"http://127.0.0.1:43110/peeper.bit/badges/list.html"},"badge list")
					h("span",". Send to Peeper the proof of achievement and your email to receive the badge.")
					h("h4","Questions?")
					h("span","Mention us in Peeper, by using ")
					h("code","@Peeper:")
					h("span"," in a post/comment.")
					h("h4","News?")
					h("a",{href:"http://127.0.0.1:43110/peeper.bit/?Profile/1oranGeS2xsKZ4jVsu9SVttzgkYXu4k9v/1EbCmWB1LcB6NdJhRBhu6krKCs3gZhePzp/peeper@zeroid.bit"},"Follow Peeper")
					h("span",".")
					h("br","bottom") #make it "unique"
				])
			else
				h("h1","Loading Settings...")
				@need_update = true
		])

	update: =>
		@need_update = true
		Page.projector.scheduleRender()

window.ContentBadges = ContentBadges
