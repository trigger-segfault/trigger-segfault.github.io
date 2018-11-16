
enum ProgressTypes {
    routes = 0,
    endings = 1,
    episodes = 2,
    sidestories = 3,
}

namespace EnumHelper {
    
}

namespace ProgressTypes {
    var values: ProgressTypes[];
    var names: string[];

    export function getFriendlyName(progressType: ProgressTypes): string {
        switch (progressType) {
            case ProgressTypes.routes: return "Routes";
            case ProgressTypes.endings: return "Endings";
            case ProgressTypes.episodes: return "Episodes";
            case ProgressTypes.sidestories: return "Other";
        }
    }
    export  function getValues(): ProgressTypes[] {
        if (values == null) {
            values = [];
            for (var value in ProgressTypes) {
                if (typeof value === 'number')
                    values.push(value);
            }
        }
        return values;
    }
    export function getNames(): string[] {
        if (names == null) {
            names = [];
            for (var name in ProgressTypes) {
                if (typeof name === 'string')
                    names.push(name);
            }
        }
        return names;
    }
}

enum StatusTypes {
    playing = 1,
    completed = 2,
    onhold = 3,
    dropped = 4,
    planning = 6,
    all = 7,
}

namespace StatusTypes {
    var values: StatusTypes[];
    var names: string[];

    export function getFriendlyName(statusType: StatusTypes): string {
        switch (statusType) {
            case StatusTypes.all: return "All Visual Novels";
            case StatusTypes.playing: return "Currently Playing";
            case StatusTypes.completed: return "Completed";
            case StatusTypes.onhold: return "On-Hold";
            case StatusTypes.dropped: return "Dropped";
            case StatusTypes.planning: return "Plan to Play";
        }
    }
    export function getFriendlyShortName(statusType: StatusTypes): string {
        switch (statusType) {
            case StatusTypes.all: return "All";
            case StatusTypes.playing: return "Playing";
            case StatusTypes.completed: return "Completed";
            case StatusTypes.onhold: return "On-Hold";
            case StatusTypes.dropped: return "Dropped";
            case StatusTypes.planning: return "Planning";
        }
    }
    export function getValues(): StatusTypes[] {
        if (values == null) {
            values = [];
            for (var value in StatusTypes) {
                if (typeof value === 'number')
                    values.push(value);
            }
        }
        return values;
    }
    export function getNames(): string[] {
        if (names == null) {
            names = [];
            for (var name in StatusTypes) {
                if (typeof name === 'string')
                    names.push(name);
            }
        }
        return names;
    }
}

class VNStats2 {
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

        this.totalScore = 0;
        this.totalScoredEntries = 0;
        for (var i = 0; i < ProgressTypes.getNames().length; i++) {
            this[ProgressTypes.getNames()[i]] = 0;
        }
        for (var i = 0; i < StatusTypes.getNames().length; i++) {
            this[StatusTypes.getNames()[i]] = 0;
        }
    }

    get meanScore() : number {
        return this.totalScore / this.totalScoredEntries;
    }

    add(vn) {
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
        for (var i = 0; i < ProgressTypes.getNames().length; i++) {
            var type = ProgressTypes.getNames()[i];
            if (vn.progress[type] != null)
                this[type] += vn.progress[type][0];
        };
        this[vn.status]++;
        this.totalEntries++;
        if (vn.score != null) {
            this.totalScore += vn.score;
            this.totalScoredEntries++;
        }
    }

    buildList(div) {
        for (let progress of ProgressTypes.getValues()) {
            this.buildBasic(div, ProgressTypes.getFriendlyName(progress), this[progress]);
        }
        this.buildBr(div);
        for (let status of StatusTypes.getValues()) {
            if (status == StatusTypes.all)
                continue;
            this.buildBasic(div, StatusTypes.getFriendlyShortName(status), this[status]);
        }
        this.buildBasic(div, 'Total', this.totalEntries);
        this.buildBr(div);
        this.buildBasic(div, 'Achievements', this.achievements);
        this.buildBasic(div, 'Days', (this.playing / 24.0).toPrecision(2));
        this.buildBasic(div, 'Mean Score', this.meanScore.toPrecision(2));
    }

    buildBasic(div, name, value) {
        if (div.innerHTML.length != 0)
            div.innerHTML += ',';
        div.innerHTML += '\n' + name + ': ' + value;
    }
    buildTitleSpan(div, name, title, value) {
        if (div.innerHTML.length != 0)
            div.innerHTML += ',';
        var span = document.createElement('span');
        span.title = title;
        span.innerText = name;
        div.innerHTML += '\n' + span.outerHTML + ': ' + value;
    }
    buildBr(div) {
        div.appendChild(document.createElement('br'));
        div.innerHTML += '\n';
    }
}

class VNProgress2 {
    hideProgress: boolean;
    progressType: ProgressTypes;
    progressType2: ProgressTypes;

    routes: number[];
    endings: number[];
    episodes: number[];
    sidestories: number[];
    constructor(data) {
        this.routes = null;
        this.endings = null;
        this.episodes = null;
        this.sidestories = null;

        this.hideProgress = false;
        if (data.hideProgress != null)
            this.hideProgress = data.hideProgress;

        this.progressType = data.progressType;
        this.progressType2 = data.progressType2;
        if (data.progressType == null && data.progressType2 != null)
            throw new Error('progressType1 cannot be null when progressType2 is set for ' + data.title + '!');

        for (var i = 0; i < ProgressTypes.getNames().length; i++) {
            var type = ProgressTypes.getNames()[i];
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
                        throw new Error('Current progress ' + type + ' is greater than max progress for ' + data.title + '!');
                    this[type] = progress;
                }
                else {
                    throw new Error('Progress ' + type + ' must be an array of length 2 or null for ' + data.title + '!');
                }
            }
        };

        if (this.progressType != null && this[this.progressType] == null) {
            this[this.progressType] = [0, 0];
        }
        if (this.progressType2 != null && this[this.progressType2] == null) {
            this[this.progressType2] = [0, 0];
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
            var progress = this[this.progressType];
            var spanFullProgress = document.createElement('span');
            tdProgress.appendChild(spanFullProgress);

            var spanType = document.createElement('span');
            spanType.innerText = ProgressTypes.getFriendlyName(this.progressType);
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
                var progress = this[this.progressType2];
                var spanFullProgress = document.createElement('span');
                tdProgress.appendChild(spanFullProgress);

                var spanType = document.createElement('span');
                spanType.innerText = ProgressTypes.getFriendlyName(this.progressType2);
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

class VNEntry2 {
    title: string;
    url: string;
    image: string;
    type: string; // Unused atm

    status: StatusTypes;
    score: number;
    progress: VNProgress2;
    achievements: number[];
    completion: number;

    playtime: number;
    playtimeHours: number;
    playtimeMinutes: number;

    start: Date;
    finish: Date;

    tags: string[];
    notes: string;
    constructor(data, status) {
        this.title = data.title;
        this.url = data.url;
        this.image = data.image;
        this.type = data.type;

        this.status = status;

        this.score = data.score;
        //this.progressType = data.progressType;
        //this.progress = data.progress;
        this.progress = new VNProgress2(data);
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
            this.playtimeMinutes = Math.floor((data.playtime % 1.0) * 100.0);
            //this.playtime = new TimeSpan(0, 0, minutes, hours);
            // TODO: Get mad when the minutes are invalid.

            this.playtime = this.playtimeHours + (this.playtimeMinutes / 60.0);
        }
        this.start = null;
        this.finish = null;
        if (data.start != null)
            this.start = new Date(data.start);
        if (data.finish != null)
            this.finish = new Date(data.finish);
        //this.start = data.start;
        //this.finish = data.finish;
        this.tags = data.tags;
        this.notes = data.notes;
    }

    buildTableSection(number) {
        var tbody = document.createElement('tbody');
        tbody.className = 'list-item';
        var tr = document.createElement('tr');
        tr.className = 'list-table-data';
        tbody.appendChild(tr);

        var tdStatus = document.createElement('td');
        tdStatus.className = 'data status ' + this.status;
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

        tr.appendChild(this.buildNormalTd('score', this.score));

        //tr.appendChild(this.buildProgressTd('progress', this.progressType, this.progress));
        tr.appendChild(this.progress.buildProgressTd());
        tr.appendChild(this.buildProgressTd('achievements', null, this.achievements));

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
        }

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

        return tbody;
    }

    buildNormalTd(className, value) {
        var td = document.createElement('td');
        td.className = 'data ' + className;
        if (value != null)
            td.innerText = value;
        else
            td.innerText = '-';
        return td;
    }

    buildProgressTd(className, type, array) {
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

function initializeVNList2() {
    loadJSON2('data/vnlist.json', initializeVNListJson2);
}

function initializeVNListJson2(jsonText) {
    var json = JSON.parse(stripJsonComments(jsonText));
    var table = document.getElementById('list-table');
    var listStats = document.getElementById('list-stats');

    var list: VNEntry2[] = [];
    for (let status of StatusTypes.getValues()) {
        if (status == StatusTypes.all)
            continue;
        loadStatus2(json, status, list);
    }
    /*loadStatus(json, 'playing', list);
    loadStatus(json, 'completed', list);
    loadStatus(json, 'onhold', list);
    loadStatus(json, 'dropped', list);
    loadStatus(json, 'planning', list);*/

    var stats = new VNStats2();

    for (var i = 0; i < list.length; i++) {
        table.appendChild(list[i].buildTableSection(i + 1));
        stats.add(list[i]);
    }
    console.log(stats);

    stats.buildList(listStats);
}

function loadJSON2(url: string, callback: (jsonText: string) => void) {
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

function loadStatus2(json, status: StatusTypes, list: VNEntry2[]) {
    var statusArray = json[StatusTypes[status]];
    if (statusArray == null)
        return;

    var statusList = [];
    for (var i = 0; i < statusArray.length; i++) {
        statusList.push(new VNEntry2(statusArray[i], status));
    }
    statusList.sort(function (a, b) { return a.title.toLowerCase().localeCompare(b.title.toLowerCase()) });
    Array.prototype.push.apply(list, statusList);
}
