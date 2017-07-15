class ContentDonate extends Class
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
			Page.changeTitle "Donate"

		h("div#Content.center", [
			if Page.local_storage_loaded
				h("div.post.settings",{style:"border-radius: 16px"},[
					h("br","top") #make it "unique"
					h("div",{style:"display:flex;"},[
						h("h1",{style:"margin:6px;"},"Donate")
					])
					h("h2","Help Peeper grow like Twitter and other surfacenet social networks")
					h("h4","Donate any amount in Bitcoin to the following address:")
					h("img",{src:"img/donate.jpg"})
					h("br")
					h("a",{href:"bitcoin:1MEaLzSbzXmStAowrivK1Vu4iSEWLxgZLJ"},"1MEaLzSbzXmStAowrivK1Vu4iSEWLxgZLJ")
					h("small"," (This is the same address of Peeper in ZeroNet)")
					h("br")
					h("span"," Any amount you donate, I and possibly the community will be very grateful.")
					h("i.fa.fa-heart.icon-heart")
					h("h4","For where your BTC is going?")
					h("span","All donations/transactions are registered ")
					h("a",{href:"https://blockchain.info/address/1MEaLzSbzXmStAowrivK1Vu4iSEWLxgZLJ"},"here")
					h("span"," and every transaction with amount that I'll withdraw, will be linked in the issue that is offering the bounty. You can see the issues, the bounty offered and the developer(s). You can see more at our ")
					h("a",{href:"https://github.com/World-wd/Peeper/issues/"},"GitHub issues")
					h("span",".")
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

window.ContentDonate = ContentDonate
