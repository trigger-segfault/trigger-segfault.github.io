namespace VisualNovelList {

declare var isTouchDevice: any;
declare var stripJsonComments: any;

enum ProgressType {
	routes = 0,
	endings = 1,
	episodes = 2,
	sidestories = 3,
}

namespace ProgressType {
	var values: ProgressType[];
	var names: string[];

	export function getFriendlyName(progressType: ProgressType): string {
		switch (progressType) {
			case ProgressType.routes: return "Routes";
			case ProgressType.endings: return "Endings";
			case ProgressType.episodes: return "Episodes";
			case ProgressType.sidestories: return "Other";
		}
	}
	export function getValues(): ProgressType[] {
		if (values == null) {
			values = [];
			var keys = Object.keys(ProgressType);
			for (var i = 0; i < keys.length; i++) {
				var name = keys[i];
				if (typeof ProgressType[name] === 'number')
					values.push(ProgressType[name]);
			}
		}
		return values;
	}
	export function getNames(): string[] {
		if (names == null) {
			names = [];
			var keys = Object.keys(ProgressType);
			for (var i = 0; i < keys.length; i++) {
				var name = keys[i];
				if (typeof ProgressType[name] === 'number')
					names.push(name);
			}
		}
		return names;
	}
}

enum StatusType {
	playing = 1,
	queued = 2,
	completed = 3,
	onhold = 4,
	dropped = 5,
	planning = 6,
	all = 7,
}

namespace StatusType {
	var values: StatusType[];
	var names: string[];

	export function getFriendlyName(statusType: StatusType): string {
		switch (statusType) {
			case StatusType.all: return "All Visual Novels";
			case StatusType.playing: return "Currently Playing";
			case StatusType.queued: return "Queued";
			case StatusType.completed: return "Completed";
			case StatusType.onhold: return "On-Hold";
			case StatusType.dropped: return "Dropped";
			case StatusType.planning: return "Plan to Play";
		}
	}
	export function getFriendlyShortName(statusType: StatusType): string {
		switch (statusType) {
			case StatusType.all: return "All";
			case StatusType.playing: return "Playing";
			case StatusType.queued: return "Queued";
			case StatusType.completed: return "Completed";
			case StatusType.onhold: return "On-Hold";
			case StatusType.dropped: return "Dropped";
			case StatusType.planning: return "Plan to Play";
		}
	}
	export function getValues(): StatusType[] {
		if (values == null) {
			values = [];
			var keys = Object.keys(StatusType);
			for (var i = 0; i < keys.length; i++) {
				var name = keys[i];
				if (typeof StatusType[name] === 'number' /*&& StatusType[name] != StatusType.queued*/)
					values.push(StatusType[name]);
			}
		}
		return values;
	}
	/*export function getValuesAndQueued(): StatusType[] {
		if (values == null) {
			values = [];
			var keys = Object.keys(StatusType);
			var last = null;
			for (var i = 0; i < keys.length; i++) {
				var name = keys[i];
				if (typeof StatusType[name] === 'number')
					values.push(StatusType[name]);
			}
		}
		return values;
	}*/
	export function getNames(): string[] {
		if (names == null) {
			names = [];
			var keys = Object.keys(StatusType);
			for (var i = 0; i < keys.length; i++) {
				var name = keys[i];
				if (typeof StatusType[name] === 'number' /*&& StatusType[name] != StatusType.queued*/)
					names.push(name);
			}
		}
		return names;
	}
	/*export function getNamesAndQueued(): string[] {
		if (names == null) {
			names = [];
			var keys = Object.keys(StatusType);
			for (var i = 0; i < keys.length; i++) {
				var name = keys[i];
				if (typeof StatusType[name] === 'number')
					names.push(name);
			}
		}
		return names;
	}*/
}

class VNStats {
	playtime: number;
	achievements: number;
	gamesWithAchievements: number;
	gamesWithAllAchievements: number;
	gamesWithCompletion: number;
	gamesWithFullCompletion: number;

	routes: number;
	endings: number;
	episodes: number;
	sidestories: number;

	playing: number;
	completed: number;
	onhold: number;
	dropped: number;
	planning: number;
	totalEntries: number;
	replays: number;

	totalScore: number;
	totalScoredEntries: number;
	constructor() {
		this.playtime = 0;
		this.achievements = 0;
		this.gamesWithAchievements = 0;
		this.gamesWithAllAchievements = 0;
		this.gamesWithCompletion = 0;
		this.gamesWithFullCompletion = 0;

		this.routes = 0;
		this.endings = 0;
		this.episodes = 0;
		this.sidestories = 0;

		this.playing = 0;
		this.completed = 0;
		this.onhold = 0;
		this.dropped = 0;
		this.planning = 0;
		this.totalEntries = 0;
		this.replays = 0;

		this.totalScore = 0;
		this.totalScoredEntries = 0;
		for (var i = 0; i < ProgressType.getNames().length; i++) {
			this[ProgressType.getNames()[i]] = 0;
		}
		for (var i = 0; i < StatusType.getNames().length; i++) {
			this[StatusType.getNames()[i]] = 0;
		}
	}

	get meanScore() : number {
		return this.totalScore / this.totalScoredEntries;
	}

	add(vn: VNEntry) {
		this.playtime += vn.playtime;
		if (vn.achievements != null) {
			this.achievements += vn.achievements[0];
			this.gamesWithAchievements++;
			if (vn.achievements[0] == vn.achievements[1])
				this.gamesWithAllAchievements++;
		}
		if (vn.completion != null) {
			this.gamesWithCompletion++;
			if (vn.completion >= 100)
				this.gamesWithFullCompletion++;
		}
		for (let name of ProgressType.getNames()) {
			if (vn.progress[name] != null)
				this[name] += vn.progress[name][0];
		}
		this[StatusType[vn.status]]++;
		this.totalEntries++;
		if (vn.score != null) {
			this.totalScore += vn.score;
			this.totalScoredEntries++;
		}
		this.replays += vn.replays;
	}

	buildList(div: HTMLDivElement) {
		for (let progress of ProgressType.getValues()) {
			this.buildBasic(div, ProgressType.getFriendlyName(progress), this[ProgressType[progress]]);
		}
		this.buildBr(div);
		for (let status of StatusType.getValues()) {
			if (status == StatusType.all)
				continue;
			this.buildBasic(div, StatusType.getFriendlyShortName(status), this[StatusType[status]]);
		}
		this.buildBasic(div, 'Total', this.totalEntries);
		this.buildBr(div);
		this.buildBasic(div, 'Replayed', this.replays);
		this.buildBasic(div, 'Achievements', this.achievements);
		this.buildBasic(div, 'Days', (this.playtime / 24.0).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
		this.buildBasic(div, 'Mean Score', this.meanScore.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
	}

	buildBasic(div: HTMLDivElement, name: string, value: any) {
		if (div.innerHTML.length != 0 && !div.innerHTML.endsWith('\n'))
			div.innerHTML += ',';
		div.innerHTML += '\n' + name + ': ' + value;
	}
	buildTitleSpan(div: HTMLDivElement, name: string, title: string, value: any) {
		if (div.innerHTML.length != 0 && !div.innerHTML.endsWith('\n'))
			div.innerHTML += ',';
		var span = document.createElement('span');
		span.title = title;
		span.innerText = name;
		div.innerHTML += '\n' + span.outerHTML + ': ' + value;
	}
	buildBr(div: HTMLDivElement) {
		//div.innerHTML += ',';
		div.appendChild(document.createElement('br'));
		div.innerHTML += '\n';
	}
}

class VNProgress {
	hideProgress: boolean;
	progressType: ProgressType;
	progressType2: ProgressType;

	routes: number[];
	endings: number[];
	episodes: number[];
	sidestories: number[];
	constructor(data: any) {
		this.routes = null;
		this.endings = null;
		this.episodes = null;
		this.sidestories = null;

		this.hideProgress = false;
		if (data.hideProgress != null)
			this.hideProgress = data.hideProgress;

		this.progressType = ProgressType[data.progressType as string];
		this.progressType2 = ProgressType[data.progressType2 as string];
		if (data.progressType == null && data.progressType2 != null)
			throw new Error('progressType1 cannot be null when progressType2 is set for ' + data.title + '!');

		for (var i = 0; i < ProgressType.getNames().length; i++) {
			var type = ProgressType.getNames()[i];
			var progress = data[type];
			if (progress != null) {
				if (typeof progress === typeof [] && progress.length == 2) {
					if (progress[0] == null)
						progress[0] = 0;
					else if (progress[0] < 0)
						throw new Error('Current progress ' + type + ' is less than zero for ' + data.title + '!');
					if (progress[1] == null)
						progress[1] = 0;
					else if (progress[1] < 0)
						throw new Error('Max progress ' + type + ' is less than zero for ' + data.title + '!');
					if (progress[0] > progress[1])
						console.warn('Current progress ' + type + ' is greater than max progress for ' + data.title + '!');
					this[type] = progress;
				}
				else {
					throw new Error('Progress ' + type + ' must be an array of length 2 or null for ' + data.title + '!');
				}
			}
		};

		if (this.progressType != null && this[ProgressType[this.progressType]] == null) {
			this[ProgressType[this.progressType]] = [0, 0];
		}
		if (this.progressType2 != null && this[ProgressType[this.progressType2]] == null) {
			this[ProgressType[this.progressType2]] = [0, 0];
		}
		if (this.endings == null) {
			if (this.routes != null) {
				this.endings = this.routes;
			}
			else if (this.episodes != null && this.episodes[0] == this.episodes[1]) {
				this.endings = [1, 1];
			}
			else if (this.sidestories != null && this.sidestories[0] == this.sidestories[1]) {
				this.endings = [1, 1];
			}
			else {
				console.log('no endings for ' + data.title);
				this.endings = [0, 1];
			}
		}
	}

	/*get getProgress() {
		if (progressType != null)
			return this[progressType];
		return null;
	}
	get getProgress2() {
		if (progressType != null)
			return this[progressType];
		return null;
	}

	get hasProgress() {
		return this.progressType != null;
	}
	get hasProgress2() {
		return this.progressType2 != null;
	}

	get hasRoutes() {
		return this.routes != null;
	}

	get hasEndings() {
		return this.endings != null && this.endings[1] > 0;
	}*/

	buildProgressTd() {
		var tdProgress = document.createElement('td');
		tdProgress.className = 'data progress';
		if (this.progressType != null) {
			var progress = this[ProgressType[this.progressType]];
			var spanFullProgress = document.createElement('span');
			tdProgress.appendChild(spanFullProgress);

			var spanType = document.createElement('span');
			spanType.innerText = ProgressType.getFriendlyName(this.progressType);
			spanFullProgress.appendChild(spanType);
			spanFullProgress.appendChild(document.createElement('br'));

			var spanProgress = document.createElement('span');
			var spanTotal = document.createElement('span');
			if (progress[0] != null && progress[0] > 0)
				spanProgress.innerText = progress[0];
			else
				spanProgress.innerText = '-';
			if (progress[1] != null && progress[1] > 0)
				spanTotal.innerText = progress[1];
			else
				spanTotal.innerText = '-';

			spanFullProgress.appendChild(spanProgress);
			spanFullProgress.innerHTML += '\n/\n';
			spanFullProgress.appendChild(spanTotal);

			if (this.progressType2 != null) {
				spanFullProgress.appendChild(document.createElement('br'));
				var progress = this[ProgressType[this.progressType2]];
				var spanFullProgress = document.createElement('span');
				tdProgress.appendChild(spanFullProgress);

				var spanType = document.createElement('span');
				spanType.innerText = ProgressType.getFriendlyName(this.progressType2);
				spanFullProgress.appendChild(spanType);
				spanFullProgress.appendChild(document.createElement('br'));

				var spanProgress = document.createElement('span');
				var spanTotal = document.createElement('span');
				if (progress[0] != null && progress[0] > 0)
					spanProgress.innerText = progress[0];
				else
					spanProgress.innerText = '-';
				if (progress[1] != null && progress[1] > 0)
					spanTotal.innerText = progress[1];
				else
					spanTotal.innerText = '-';

				spanFullProgress.appendChild(spanProgress);
				spanFullProgress.innerHTML += '\n/\n';
				spanFullProgress.appendChild(spanTotal);
			}
		}
		else {
			tdProgress.innerText = '-';
		}
		return tdProgress;
	}
}

function parseDate(s: string): Date {
	var parts = s.split('-');
	if (parts.length != 3)
		throw new Error('Invalid date ' + s + '!');
	return new Date(Number.parseInt(parts[0]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[2]));
	/*for (var i = 1; i < 3; i++) {
		if (parts[i].length == 1)
		parts[i] = '0' + parts[i];
	}
	return new Date((parts.join('-') + 'T00:00:00').replace(/-/g, '\/').replace(/T.+/, ''));
	*/
}

class VNPlaythrough {
	start: Date;
	finish: Date;
	playtime: number;
	playtimeHours: number;
	playtimeMinutes: number;
	
	constructor(data: any) {
		this.playtime = 0;
		this.playtimeHours = 0;
		this.playtimeMinutes = 0;
		if (data.playtime != null) {
			// TODO: Get mad when playtime is less than 0
			this.playtime = data.playtime;
			// Playtime is input as fixed hh.mm
			//var hours = Math.floor(data.playtime);
			//var minutes = Math.floor((data.playtime % 1.0) * 100.0);
			if (this.playtime != 0) {
				this.playtimeHours = Math.floor(data.playtime);
				this.playtimeMinutes = Math.round((data.playtime % 1.0) * 100.0);
				//this.playtime = new TimeSpan(0, 0, minutes, hours);
				// TODO: Get mad when the minutes are invalid.

				this.playtime = this.playtimeHours + (this.playtimeMinutes / 60.0);
			}
		}
		this.start = null;
		this.finish = null;
		if (data.start != null)
			this.start = parseDate(data.start);
		if (data.finish != null)
			this.finish = parseDate(data.finish);
	}
}

class VNEntry {
	title: string;
	url: string;
	image: string;
	type: string; // Unused atm

	status: StatusType;
	score: number;
	progress: VNProgress;
	achievements: number[];
	completion: number;

	playtime: number;
	playtimeHours: number;
	playtimeMinutes: number;

	playthroughs: VNPlaythrough[];

	start: Date;
	finish: Date;

	tags: string[];
	notes: string;

	tbody: HTMLTableSectionElement;
	tdNumber: HTMLTableDataCellElement;
	constructor(data: any, status:StatusType) {
		this.title = data.title;
		this.url = data.url;
		this.image = data.image;
		this.type = data.type;

		this.status = status;

		this.score = data.score;
		//this.progressType = data.progressType;
		//this.progress = data.progress;
		this.progress = new VNProgress(data);
		this.achievements = data.achievements;
		this.completion = data.completion;
		/*this.playtime = 0;
		this.playtimeHours = 0;
		this.playtimeMinutes = 0;
		if (data.playtime != null) {
			// TODO: Get mad when playtime is less than 0
			this.playtime = data.playtime;
			// Playtime is input as fixed hh.mm
			//var hours = Math.floor(data.playtime);
			//var minutes = Math.floor((data.playtime % 1.0) * 100.0);
			this.playtimeHours = Math.floor(data.playtime);
			this.playtimeMinutes = Math.round((data.playtime % 1.0) * 100.0);
			//this.playtime = new TimeSpan(0, 0, minutes, hours);
			// TODO: Get mad when the minutes are invalid.

			this.playtime = this.playtimeHours + (this.playtimeMinutes / 60.0);
		}
		this.start = null;
		this.finish = null;
		if (data.start != null)
			this.start = parseDate(data.start);
		if (data.finish != null)
			this.finish = parseDate(data.finish);*/
		this.playthroughs = [];
		this.playthroughs.push(new VNPlaythrough(data));
		this.start = this.playthroughs[0].start;
		this.finish = this.playthroughs[0].finish;
		if (data.replays != null) {
			for (var i = 0; i < data.replays.length; i++) {
				this.playthroughs.push(new VNPlaythrough(data.replays[i]));
			}
		}
		this.playtime = 0;
		this.playtimeHours = 0;
		this.playtimeMinutes = 0;
		for (var i = 0; i < this.playthroughs.length; i++) {
			var playthrough = this.playthroughs[i];
			this.playtime += playthrough.playtime;
			this.playtimeHours += playthrough.playtimeHours;
			this.playtimeMinutes += playthrough.playtimeMinutes;
		}
		//this.start = data.start;
		//this.finish = data.finish;
		this.tags = data.tags;
		if (data.notes == null) {

		}
		else if (typeof data.notes === 'string') {
			this.notes = data.notes;
		}
		else if (typeof data.notes === typeof [] && data.notes.length > 0) {
			for (var i = 0; i < data.notes.length; i++) {
				var note: string = data.notes[i] as string;
				note = note.trim();
				switch (note[note.length - 1]) {
					case '.':
					case ',':
					case '!':
					case '?':
						break;
					default:
						note += '.';
				}
				data.notes[i] = note;
			}
			this.notes = data.notes.join(' ');
		}
	}

	get replays() {
		return this.playthroughs.length - 1;
	}

	buildTableSection(number: number) {
		this.tbody = document.createElement('tbody');
		this.tbody.className = 'list-item';
		var tr = document.createElement('tr');
		tr.className = 'list-table-data';
		this.tbody.appendChild(tr);

		var tdStatus = document.createElement('td');
		tdStatus.className = 'data status ' + StatusType[this.status];
		tr.appendChild(tdStatus);

		var tdNumber = document.createElement('td');
		tdNumber.className = 'data number';
		tdNumber.innerText = number.toString();
		tr.appendChild(tdNumber);

		var tdImage = document.createElement('td');
		tdImage.className = 'data image';
		tr.appendChild(tdImage);
		var imgImage = document.createElement('img');
		imgImage.className = 'hover-info image';
		imgImage.src = this.image;
		tdImage.appendChild(imgImage);

		var tdTitle = document.createElement('td');
		tdTitle.className = 'data title clearfix';
		tr.appendChild(tdTitle);
		var aTitle = document.createElement('a');
		aTitle.className = 'link sort';
		aTitle.href = this.url;
		aTitle.innerText = this.title;
		tdTitle.appendChild(aTitle);
		if (this.notes != null) {
			var bNotes = document.createElement('b');
			bNotes.className = 'notes';
			bNotes.innerText = this.notes;
			tdTitle.appendChild(bNotes);
		}

		tr.appendChild(this.buildNormalTd('score', this.score));

		//tr.appendChild(this.buildProgressTd('progress', this.progressType, this.progress));
		tr.appendChild(this.progress.buildProgressTd());
		//tr.appendChild(this.buildProgressTd('achievements', null, this.achievements));

		var tdCompletion = document.createElement('td');
		tdCompletion.className = 'data completion';
		tr.appendChild(tdCompletion);
		if (this.achievements != null) {
			var spanAchievements = document.createElement('span');
			spanAchievements.title = 'Achievements Acquired';
			tdCompletion.appendChild(spanAchievements);
			var spanType = document.createElement('span');
			spanType.innerText = 'Achievements';
			spanAchievements.appendChild(spanType);
			spanAchievements.appendChild(document.createElement('br'));
			var spanProgress = document.createElement('span');
			var spanTotal = document.createElement('span');
			if (this.achievements[0] != null)
				spanProgress.innerText = this.achievements[0].toString();
			else
				spanProgress.innerText = '-';
			if (this.achievements[1] != null)
				spanTotal.innerText = this.achievements[1].toString();
			else
				spanTotal.innerText = '-';
			spanAchievements.appendChild(spanProgress);
			spanAchievements.innerHTML += '\n/\n';
			spanAchievements.appendChild(spanTotal);
		}
		if (this.completion != null) {
			if (this.achievements != null)
				tdCompletion.appendChild(document.createElement('br'));
			var spanCompletion = document.createElement('span');
			spanCompletion.title = 'Completion Percentage';
			var spanType = document.createElement('span');
			spanType.innerText = 'Completion';
			spanCompletion.appendChild(spanType);
			spanCompletion.appendChild(document.createElement('br'));
			tdCompletion.appendChild(spanCompletion);
			var spanPercent = document.createElement('span');
			spanPercent.innerText = this.completion.toString();
			spanCompletion.appendChild(spanPercent);
			spanCompletion.innerHTML += '\n%';
			//spanCompletion.appendChild('%');
		}
		if (this.achievements == null && this.completion == null) {
			tdCompletion.innerText = '-';
		}
		/*return tdProgress;
		var tdCompletion = document.createElement('td');
		tdCompletion.className = 'data completion';
		tr.appendChild(tdCompletion);
		if (this.completion != null) {
			var spanCompletion = document.createElement('span');
			tdCompletion.appendChild(spanCompletion);
			var spanPercent = document.createElement('span');
			spanPercent.innerText = this.completion.toString();
			spanCompletion.appendChild(spanPercent);
			spanCompletion.innerHTML += '\n%';
			//spanCompletion.appendChild('%');
		}
		else {
			tdCompletion.innerText = '-';
		}*/

		//tr.appendChild(this.buildNormalTd('playtime', this.playtime));
		var tdPlaytime = document.createElement('td');
		tdPlaytime.className = 'data playtime';
		tr.appendChild(tdPlaytime);
		/*if (this.replays == 0) {
			if (this.playtime != 0 && (this.playtimeHours > 0 || this.playtimeMinutes > 0)) {
				if (this.playtimeHours > 0) {
					if (this.playtimeMinutes > 0)
						tdPlaytime.innerText = this.playtimeHours + 'h ' + this.playtimeMinutes + 'm';
					else
						tdPlaytime.innerText = this.playtimeHours + 'h';
				}
				else
					tdPlaytime.innerText = this.playtimeMinutes + 'm';
			}
			else
				tdPlaytime.innerText = '-';
		}*/
		if (this.playtime != 0) {
			var spanPlaytime = document.createElement('span');
			tdPlaytime.appendChild(spanPlaytime);
			if (this.playtime != 0 && (this.playtimeHours > 0 || this.playtimeMinutes > 0)) {
				if (this.playtimeHours > 0) {
					if (this.playtimeMinutes > 0)
						spanPlaytime.innerText = this.playtimeHours + 'h ' + this.playtimeMinutes + 'm';
					else
						spanPlaytime.innerText = this.playtimeHours + 'h';
				}
				else
					spanPlaytime.innerText = this.playtimeMinutes + 'm';
			}
			else
				spanPlaytime.innerText = '-';
		}
		if (this.replays != 0) {
			if (this.playtime != 0)
				tdPlaytime.appendChild(document.createElement('br'));
			var spanReplays = document.createElement('span');
			spanReplays.innerText = 'Replays: ' + this.replays.toString();
			tdPlaytime.appendChild(spanReplays);
		}


		var tdStartFinish = document.createElement('td');
		tdStartFinish.className = 'data start-finish';
		tr.appendChild(tdStartFinish);
		if (this.start == null && this.finish == null) {
			tdStartFinish.innerText = '-';
		}
		else {
			var spanStartFinish = document.createElement('span');
			tdStartFinish.appendChild(spanStartFinish);
			if (this.start != null) {
				var spanStart = document.createElement('span');
				spanStartFinish.appendChild(spanStart);
				spanStart.innerText = this.start.toLocaleDateString() + ' -';
				if (this.finish != null) {
					spanStartFinish.appendChild(document.createElement('br'));
					var spanFinish = document.createElement('span');
					spanFinish.innerText = this.finish.toLocaleDateString();
					spanStartFinish.appendChild(spanFinish);
				}
			}
			else if (this.finish != null) {
				var spanFinish = document.createElement('span');
				spanFinish.innerText = this.finish.toLocaleDateString();
				tdStartFinish.appendChild(spanFinish);
			}
		}

		var tdTags = document.createElement('td');
		tdTags.className = 'data tags';
		tr.appendChild(tdTags);
		var divTags = document.createElement('div');
		divTags.className = 'tags';
		tdTags.appendChild(divTags);
		for (var i = 0; this.tags != null && i < this.tags.length; i++) {
			var spanTag = document.createElement('span');
			divTags.appendChild(spanTag);
			var aTag = document.createElement('a');
			aTag.className = 'tag-item';
			aTag.href = '#';
			aTag.innerText = this.tags[i];
			spanTag.innerHTML = aTag.outerHTML;
			if (i + 1 < this.tags.length)
				spanTag.innerHTML += ', ';
		}

		/*var tdProgress = document.createElement('td');
		tdProgress.className = 'data progress';
		tr.appendChild(tdNumber);
		if (this.progress != null) {
			var spanFullProgress = document.createElement('span');
			tdProgress.appendChild(spanFullProgress);
			var spanProgress = document.createElement('span');
			var spanTotal = document.createElement('span');
			if (this.progress[0] != null)
				spanProgress.innerText = this.progress[0];
			else
				spanProgress.innerText = '-';
			spanTotal.innerText = this.progress[1];
			spanFullProgress.appendChild(spanProgress);
			spanFullProgress.appendChild('/');
			spanFullProgress.appendChild(spanTotal);
		}
		else {
			tdProgress.innerText = '-';
		}*/

		this.tdNumber = tdNumber;
		return this.tbody;
	}

	buildNormalTd(className: string, value: any) {
		var td = document.createElement('td');
		td.className = 'data ' + className;
		if (value != null)
			td.innerText = value;
		else
			td.innerText = '-';
		return td;
	}

	buildProgressTd(className: string, type: string, array: any[]) {
		var tdProgress = document.createElement('td');
		tdProgress.className = 'data ' + className;
		if (array != null) {
			var spanFullProgress = document.createElement('span');
			tdProgress.appendChild(spanFullProgress);
			if (type != null) {
				var spanType = document.createElement('span');
				spanType.innerText = type;
				spanFullProgress.appendChild(spanType);
				spanFullProgress.appendChild(document.createElement('br'));
			}
			var spanProgress = document.createElement('span');
			var spanTotal = document.createElement('span');
			if (array[0] != null)
				spanProgress.innerText = array[0];
			else
				spanProgress.innerText = '-';
			spanTotal.innerText = array[1];
			spanFullProgress.appendChild(spanProgress);
			spanFullProgress.innerHTML += '\n/\n';
			spanFullProgress.appendChild(spanTotal);
		}
		else {
			tdProgress.innerText = '-';
		}
		return tdProgress;
	}
}

var vnList: VNEntry[] = [];
//var ascendingOrders: boolean[] = [];
var currentCategory: string = null;
var currentAscending: boolean = false;
var currentStatus:StatusType = StatusType.all;
var currentTag: string = null;
var touchedTbody: HTMLTableSectionElement = null;

export function initializeVNList() {
	loadJSON('/anime/assets/data/vnlist.jsonc', initializeVNListJson);
}

function initializeVNListJson(jsonText: string) {
	var json = JSON.parse(stripJsonComments(jsonText, null));
	var table = document.getElementById('list-table') as HTMLTableElement;
	var listStats = document.getElementById('list-stats') as HTMLDivElement;
	var clearTags = document.getElementById('tags-clear') as HTMLAnchorElement;
	var statusButtons = document.getElementById('status-menu-buttons');
	
	for (let status of StatusType.getValues()) {
		if (status == StatusType.all)
			continue;
		loadStatus(json, status);
	}

	var stats = new VNStats();

	for (var i = 0; i < vnList.length; i++) {
		table.appendChild(vnList[i].buildTableSection(i + 1));
		stats.add(vnList[i]);
	}
	console.log(stats);

	stats.buildList(listStats);

	// do the work...
	document.querySelectorAll('.sort-category').forEach(th => th.addEventListener('click', (() => {
		//const table = th.closest('table');
		var category = th.classList[th.classList.length - 2];
		console.log(category);
		if (currentCategory != category) {
			currentCategory = category;
			currentAscending = false;
		}
		else {
			currentAscending = !currentAscending;
		}
		vnList.sort(vnComparer(category, currentAscending));
		updateEntries(table);
	})));
	
	clearTags.addEventListener('click', function () {
		currentTag = null;
		updateEntries(table);
		clearTags.style.display = 'none';
	});

	document.querySelectorAll('.tag-item').forEach(aTag => aTag.addEventListener('click', (() => {
		currentTag = (aTag as HTMLAnchorElement).innerText;
		updateEntries(table);
		clearTags.style.display = null;
	})));

	document.querySelectorAll('.status-button').forEach(button => button.addEventListener('click', (() => {
		var statusStr = button.classList[button.classList.length - 1].toString();
		// Check if we're already using this status
		if (statusStr == 'on')
			return;
		currentStatus = StatusType[statusStr];
		button.classList.add('on');
		for (var i = 0; i < statusButtons.children.length; i++) {
			var statusButton = statusButtons.children[i];
			if (statusButton != button && statusButton.classList.contains('on')) {
				statusButton.classList.remove('on');
			}
		}
		updateEntries(table);
	})));

	/*document.addEventListener('touchcancel', function (ev){
		if (ev.type == 'click') {
			ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
	
			// Ajax behavior here!
		}
	}, false);*/
	/*$('.static_parent').on('touchstart mouseenter', '.link', function (ev) {
		// As it's the chain's last event we only prevent it from making HTTP request
	});
	
	$('.static_parent').on('mouseleave touchmove click', '.link', function (ev) {
		$(this).removeClass('hover_effect');
	
		// As it's the chain's last event we only prevent it from making HTTP request
		if (ev.type == 'click') {
			ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
	
			// Ajax behavior here!
		}
	});*/
	document.querySelectorAll('tr').forEach(tr => tr.addEventListener('click', (() => {
		function nothing() {}
		tr.addEventListener('touchstart', nothing);
		tr.removeEventListener('touchstart', nothing);
	})));
	
	// Are we on a touch device
	if (isTouchDevice()) { //'ontouchstart' in window
		document.body.classList.add('no-select-touch');
	}
	/*document.addEventListener('click', ((ev) => {
		function noithing() {}
		ev.fromElement.addEventListener('touchstart', noithing);
		ev.fromElement.removeEventListener('touchstart', noithing);
	}), true);*/
	/*document.addEventListener('scroll', (() => {
		
	}));*/
	document.getElementById('loading-spinner').style.display = 'none';
}

function updateEntries(table: HTMLTableElement) {
	var index:number = 1;
	for (var i = 0; i < vnList.length; i++) {
		var vn = vnList[i];
		var hide = ((currentStatus != StatusType.all && currentStatus != vn.status) ||
					(currentTag != null && !vn.tags.includes(currentTag)));
		if (!hide) {
			vn.tdNumber.innerText = index.toString();
			index++;
			table.appendChild(vn.tbody);
		}
		else if (table.contains(vn.tbody)) {
			table.removeChild(vn.tbody);
		}
	}
}

function loadJSON(url: string, callback: (jsonText: string) => void) {
	/*fetch(url)
		.then(response => response.json())
		.then(data => {
			callback(data) // logs your json
		});*/
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == 200) {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

function loadStatus(json: any, status: StatusType) {
	var statusArray = json[StatusType[status]];
	if (statusArray == null)
		return;

	var statusList = [];
	for (var i = 0; i < statusArray.length; i++) {
		statusList.push(new VNEntry(statusArray[i], status));
	}
	statusList.sort(function (a, b) { return a.title.toLowerCase().localeCompare(b.title.toLowerCase()) });
	Array.prototype.push.apply(vnList, statusList);
}

function compareVNs(a: VNEntry, b: VNEntry, category: string): any {
	switch (category) {
		case 'start':
			var sa = a.start;
			var sb = b.start;
			if ((sa == null) != (sb == null))
				return (sa != null ? -1 : 1);
			else if (sa == null)
				return 0;
			return sa.getTime() - sb.getTime();
		case 'finish':
			var sa = a.start;
			var sb = b.start;
			var fa = a.finish;
			var fb = b.finish;
			if ((fa == null) != (fb == null)) {
				if (fa != null && sb != null)
					return -1;
				else if (fb != null && sa != null)
					return 1;
				return (fa != null ? -1 : 1);
			}
			else if (fa == null) {
				if ((sa == null) != (sb == null))
					return (sa != null ? -1 : 1);
				else if (sa == null)
					return 0;
				return sa.getTime() - sb.getTime();
			}
			return fa.getTime() - fb.getTime();
		case 'progress':
			var pa = a.progress;
			var pb = b.progress;
			if (pa.endings[0] == pb.endings[0]) {
				if (pa.routes != null && pb.routes != null) {
					if (pa.routes[0] != pb.routes[0])
						return pa.routes[0] - pb.routes[0];
				}
				else if (pa.routes != null)
					return 1;
				else if (pb.routes != null)
					return -1;
				if (pa.episodes != null && pb.episodes != null) {
					if (pa.episodes[0] != pb.episodes[0])
						return pa.episodes[0] - pb.episodes[0];
				}
				else if (pa.episodes != null)
					return 1;
				else if (pb.episodes != null)
					return -1;
				if (pa.sidestories != null && pb.sidestories != null) {
					if (pa.sidestories[0] != pb.sidestories[0])
						return pa.sidestories[0] - pb.sidestories[0];
				}
				else if (pa.sidestories != null)
					return 1;
				else if (pb.sidestories != null)
					return -1;
				return 0;
			}
			return pa.endings[0] - pb.endings[0];
		case 'title':
			// Reverse, since we do descending by default
			return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
		default:
			var aa = a[category];
			var bb = b[category];
			if ((aa == null) != (bb == null))
				return (aa != null ? 1 : -1);
			else if (aa == null)
				return 0;
			return aa - bb;
	}
}

const vnComparer = (category: string, asc: boolean) => (a: VNEntry, b: VNEntry) => compareVNs(asc ? a : b, asc ? b : a, category);

/*const comparer = (idx, asc: boolean) => (a: VNEntry2, b: VNEntry2) => ((v1: any, v2: any) =>
	v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
)(compareVNs(asc ? a : b, asc ? b : a, idx));*/

}
