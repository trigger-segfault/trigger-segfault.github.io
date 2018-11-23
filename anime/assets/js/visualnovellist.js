var VisualNovelList;
(function (VisualNovelList) {
    var ProgressType;
    (function (ProgressType) {
        ProgressType[ProgressType["routes"] = 0] = "routes";
        ProgressType[ProgressType["endings"] = 1] = "endings";
        ProgressType[ProgressType["episodes"] = 2] = "episodes";
        ProgressType[ProgressType["sidestories"] = 3] = "sidestories";
    })(ProgressType || (ProgressType = {}));
    (function (ProgressType) {
        var values;
        var names;
        function getFriendlyName(progressType) {
            switch (progressType) {
                case ProgressType.routes: return "Routes";
                case ProgressType.endings: return "Endings";
                case ProgressType.episodes: return "Episodes";
                case ProgressType.sidestories: return "Other";
            }
        }
        ProgressType.getFriendlyName = getFriendlyName;
        function getValues() {
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
        ProgressType.getValues = getValues;
        function getNames() {
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
        ProgressType.getNames = getNames;
    })(ProgressType || (ProgressType = {}));
    var StatusType;
    (function (StatusType) {
        StatusType[StatusType["playing"] = 1] = "playing";
        StatusType[StatusType["completed"] = 2] = "completed";
        StatusType[StatusType["onhold"] = 3] = "onhold";
        StatusType[StatusType["dropped"] = 4] = "dropped";
        StatusType[StatusType["planning"] = 6] = "planning";
        StatusType[StatusType["all"] = 7] = "all";
    })(StatusType || (StatusType = {}));
    (function (StatusType) {
        var values;
        var names;
        function getFriendlyName(statusType) {
            switch (statusType) {
                case StatusType.all: return "All Visual Novels";
                case StatusType.playing: return "Currently Playing";
                case StatusType.completed: return "Completed";
                case StatusType.onhold: return "On-Hold";
                case StatusType.dropped: return "Dropped";
                case StatusType.planning: return "Plan to Play";
            }
        }
        StatusType.getFriendlyName = getFriendlyName;
        function getFriendlyShortName(statusType) {
            switch (statusType) {
                case StatusType.all: return "All";
                case StatusType.playing: return "Playing";
                case StatusType.completed: return "Completed";
                case StatusType.onhold: return "On-Hold";
                case StatusType.dropped: return "Dropped";
                case StatusType.planning: return "Plan to Play";
            }
        }
        StatusType.getFriendlyShortName = getFriendlyShortName;
        function getValues() {
            if (values == null) {
                values = [];
                var keys = Object.keys(StatusType);
                for (var i = 0; i < keys.length; i++) {
                    var name = keys[i];
                    if (typeof StatusType[name] === 'number')
                        values.push(StatusType[name]);
                }
            }
            return values;
        }
        StatusType.getValues = getValues;
        function getNames() {
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
        }
        StatusType.getNames = getNames;
    })(StatusType || (StatusType = {}));
    var VNStats = /** @class */ (function () {
        function VNStats() {
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
            this.totalScore = 0;
            this.totalScoredEntries = 0;
            for (var i = 0; i < ProgressType.getNames().length; i++) {
                this[ProgressType.getNames()[i]] = 0;
            }
            for (var i = 0; i < StatusType.getNames().length; i++) {
                this[StatusType.getNames()[i]] = 0;
            }
        }
        Object.defineProperty(VNStats.prototype, "meanScore", {
            get: function () {
                return this.totalScore / this.totalScoredEntries;
            },
            enumerable: true,
            configurable: true
        });
        VNStats.prototype.add = function (vn) {
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
            for (var _i = 0, _a = ProgressType.getNames(); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                if (vn.progress[name_1] != null)
                    this[name_1] += vn.progress[name_1][0];
            }
            this[StatusType[vn.status]]++;
            this.totalEntries++;
            if (vn.score != null) {
                this.totalScore += vn.score;
                this.totalScoredEntries++;
            }
        };
        VNStats.prototype.buildList = function (div) {
            for (var _i = 0, _a = ProgressType.getValues(); _i < _a.length; _i++) {
                var progress = _a[_i];
                this.buildBasic(div, ProgressType.getFriendlyName(progress), this[ProgressType[progress]]);
            }
            this.buildBr(div);
            for (var _b = 0, _c = StatusType.getValues(); _b < _c.length; _b++) {
                var status_1 = _c[_b];
                if (status_1 == StatusType.all)
                    continue;
                this.buildBasic(div, StatusType.getFriendlyShortName(status_1), this[StatusType[status_1]]);
            }
            this.buildBasic(div, 'Total', this.totalEntries);
            this.buildBr(div);
            this.buildBasic(div, 'Achievements', this.achievements);
            this.buildBasic(div, 'Days', (this.playtime / 24.0).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1'));
            this.buildBasic(div, 'Mean Score', this.meanScore.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1'));
        };
        VNStats.prototype.buildBasic = function (div, name, value) {
            if (div.innerHTML.length != 0 && !div.innerHTML.endsWith('\n'))
                div.innerHTML += ',';
            div.innerHTML += '\n' + name + ': ' + value;
        };
        VNStats.prototype.buildTitleSpan = function (div, name, title, value) {
            if (div.innerHTML.length != 0 && !div.innerHTML.endsWith('\n'))
                div.innerHTML += ',';
            var span = document.createElement('span');
            span.title = title;
            span.innerText = name;
            div.innerHTML += '\n' + span.outerHTML + ': ' + value;
        };
        VNStats.prototype.buildBr = function (div) {
            //div.innerHTML += ',';
            div.appendChild(document.createElement('br'));
            div.innerHTML += '\n';
        };
        return VNStats;
    }());
    var VNProgress = /** @class */ (function () {
        function VNProgress(data) {
            this.routes = null;
            this.endings = null;
            this.episodes = null;
            this.sidestories = null;
            this.hideProgress = false;
            if (data.hideProgress != null)
                this.hideProgress = data.hideProgress;
            this.progressType = ProgressType[data.progressType];
            this.progressType2 = ProgressType[data.progressType2];
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
            }
            ;
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
        VNProgress.prototype.buildProgressTd = function () {
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
        };
        return VNProgress;
    }());
    function parseDate(s) {
        var parts = s.split('-');
        if (parts.length != 3)
            throw new Error('Invalid date ' + s + '!');
        for (var i = 1; i < 3; i++) {
            if (parts[i].length == 1)
                parts[i] = '0' + parts[i];
        }
        return new Date(parts.join('-') + 'T00:00:00Z');
    }
    var VNEntry = /** @class */ (function () {
        function VNEntry(data, status) {
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
            this.playtime = 0;
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
                this.finish = parseDate(data.finish);
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
                    var note = data.notes[i];
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
        VNEntry.prototype.buildTableSection = function (number) {
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
            tdNumber.innerText = number;
            tr.appendChild(tdNumber);
            var tdImage = document.createElement('td');
            tdImage.className = 'data image';
            tr.appendChild(tdImage);
            var aImage = document.createElement('a');
            aImage.className = 'link sort';
            aImage.href = this.url;
            tdImage.appendChild(aImage);
            var imgImage = document.createElement('img');
            imgImage.className = 'hover-info image';
            imgImage.src = this.image;
            aImage.appendChild(imgImage);
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
            if (this.playtime != null && (this.playtimeHours > 0 || this.playtimeMinutes > 0)) {
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
        };
        VNEntry.prototype.buildNormalTd = function (className, value) {
            var td = document.createElement('td');
            td.className = 'data ' + className;
            if (value != null)
                td.innerText = value;
            else
                td.innerText = '-';
            return td;
        };
        VNEntry.prototype.buildProgressTd = function (className, type, array) {
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
        };
        return VNEntry;
    }());
    var vnList = [];
    //var ascendingOrders: boolean[] = [];
    var currentCategory = null;
    var currentAscending = false;
    var currentStatus = StatusType.all;
    var currentTag = null;
    var touchedTbody = null;
    function initializeVNList() {
        loadJSON('/anime/assets/data/vnlist.jsonc', initializeVNListJson);
    }
    VisualNovelList.initializeVNList = initializeVNList;
    function initializeVNListJson(jsonText) {
        var json = JSON.parse(stripJsonComments(jsonText, null));
        var table = document.getElementById('list-table');
        var listStats = document.getElementById('list-stats');
        var clearTags = document.getElementById('tags-clear');
        var statusButtons = document.getElementById('status-menu-buttons');
        for (var _i = 0, _a = StatusType.getValues(); _i < _a.length; _i++) {
            var status_2 = _a[_i];
            if (status_2 == StatusType.all)
                continue;
            loadStatus(json, status_2);
        }
        var stats = new VNStats();
        for (var i = 0; i < vnList.length; i++) {
            table.appendChild(vnList[i].buildTableSection(i + 1));
            stats.add(vnList[i]);
        }
        console.log(stats);
        stats.buildList(listStats);
        // do the work...
        document.querySelectorAll('.sort-category').forEach(function (th) { return th.addEventListener('click', (function () {
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
        })); });
        clearTags.addEventListener('click', function () {
            currentTag = null;
            updateEntries(table);
            clearTags.style.display = 'none';
        });
        document.querySelectorAll('.tag-item').forEach(function (aTag) { return aTag.addEventListener('click', (function () {
            currentTag = aTag.innerText;
            updateEntries(table);
            clearTags.style.display = null;
        })); });
        document.querySelectorAll('.status-button').forEach(function (button) { return button.addEventListener('click', (function () {
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
        })); });
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
        document.querySelectorAll('tr').forEach(function (tr) { return tr.addEventListener('click', (function () {
            function nothing() { }
            tr.addEventListener('touchstart', nothing);
            tr.removeEventListener('touchstart', nothing);
        })); });
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
    function updateEntries(table) {
        var index = 1;
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
    function loadJSON(url, callback) {
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
    function loadStatus(json, status) {
        var statusArray = json[StatusType[status]];
        if (statusArray == null)
            return;
        var statusList = [];
        for (var i = 0; i < statusArray.length; i++) {
            statusList.push(new VNEntry(statusArray[i], status));
        }
        statusList.sort(function (a, b) { return a.title.toLowerCase().localeCompare(b.title.toLowerCase()); });
        Array.prototype.push.apply(vnList, statusList);
    }
    function compareVNs(a, b, category) {
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
    var vnComparer = function (category, asc) { return function (a, b) { return compareVNs(asc ? a : b, asc ? b : a, category); }; };
    /*const comparer = (idx, asc: boolean) => (a: VNEntry2, b: VNEntry2) => ((v1: any, v2: any) =>
        v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(compareVNs(asc ? a : b, asc ? b : a, idx));*/
})(VisualNovelList || (VisualNovelList = {}));
