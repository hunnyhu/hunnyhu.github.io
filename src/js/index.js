var Note = Backbone.Model.extend({
	defaults: {
		title: 'ABC',
		dateCreated: new Date()
	},
	initialize: function() {
		console.log('init at ' + this.get('dateCreated'));
		this.on('change', function(model, option) {
			console.log('Property has been changed.');
		});
		this.on('change:title', function(model, option) {
			console.log('Title Property has been changed.' + model.get('title'));
		});
		this.on('invalid', function(model, error) {
			console.log(error);
		});
	},
	validate: function(attributes, options) {
		if (attributes.title.length < 3) {
			return 'length less then 3';
		}
	}
});

var NoteView = Backbone.View.extend({
	tagName: 'li',
	className: 'item',
	attributes: {
		'data-role': 'list'
	},
	template: _.template($('#list-template').html()),
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}
});
var NoteCollection = Backbone.Collection.extend({
	model: Note,
	initialize: function() {
		this.on({
			'add': function(model, collection, options) {
				console.log('add event.');
			},
			'remove': function(model, collection, options) {
				console.log('remove event.');
			},
			'change': function(model, collection, options) {
				console.log('change event.');
			}
		});
	}
});

var note = new Note({
	title: '这是标题测试'
});

var noteView = new NoteView({
	model: note
});

var note1 = new Note({
	id: 1,
	title: '测试1'
});
var note2 = new Note({
	id: 2,
	title: '测试2'
});

var note3 = new Note({
	id: 3,
	title: '测试3'
});

var noteCollection = new NoteCollection([note1, note2, note3]);

var NoteCollectionVew = Backbone.View.extend({
	tagName: 'ul',
	initialize: function() {
		this.collection.on('add', this.addOne, this);
		this.render();
	},
	render: function() {
		this.collection.forEach(this.addOne, this);
		return this;
	},
	addOne: function(note) {
		var noteView = new NoteView({model: note});
		this.$el.append(noteView.render().el);
	}
});
var noteCollectionView = new NoteCollectionVew({
	collection: noteCollection
});
var html = noteCollectionView.el;
console.log(html);
noteCollection.add({id: 4, title:'测试一下哈', dateCreated: new Date()});

var NoteRouter = Backbone.Router.extend({
	routes: {
		'notes(/page/:page)': 'index',
		'notes/:id': 'show',
		'login(/from/*from)': 'login'
	},
	index: function(page) {
		var page = page || 1;
		$('#note-list').html(noteCollectionView.el);
		console.log('笔记列表' + page);
	},
	show: function(id) {
		console.log('Note:' + id);
		var note = noteCollection.get(id);
		if (!note) {
			this.navigate('login/from/notes/' + id, {trigger: true});
			return;
		}
		var noteView = new NoteView({
			model: note
		});
		$('#note-details').html(noteView.render().el);
	},
	login: function(from) {
		var msg = '请先登录，地址：' + from;
		console.log(msg);
		$('#note-details').html(msg);
	}
});
var noteRouter = new NoteRouter();
Backbone.history.start();
var href = window.location.href;
if (href.indexOf('#') === -1) {
	window.location.href = href + '#notes';
} 