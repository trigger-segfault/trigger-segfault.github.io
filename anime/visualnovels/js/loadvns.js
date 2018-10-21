
class VNEntry {
    constructor(data, status) {
        this.title = data.title;
        this.url = data.url;
        this.image = data.image;
        this.type = data.type;

        this.status = status;

        this.score = data.score;
        this.progressType = data.progressType;
        this.progress = data.progress;
        this.achievements = data.achievements;
        this.completion = data.completion;
        this.playtime = data.playtime;
        this.start = data.start;
        this.finish = data.finish;
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

        tr.appendChild(this.buildProgressTd('progress', this.progressType, this.progress));
        tr.appendChild(this.buildProgressTd('achievements', null, this.achievements));

        var tdCompletion = document.createElement('td');
        tdCompletion.className = 'data completion';
        tr.appendChild(tdCompletion);
        if (this.completion != null) {
            var spanCompletion = document.createElement('span');
            tdCompletion.appendChild(spanCompletion);
            var spanPercent = document.createElement('span');
            spanPercent.innerText = this.completion;
            spanCompletion.appendChild(spanPercent);
            spanCompletion.innerHTML += '\n%';
            //spanCompletion.appendChild('%');
        }
        else {
            tdCompletion.innerText = '-';
        }

        tr.appendChild(this.buildNormalTd('playtime', this.playtime));


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
                spanStart.innerText = this.start + ' -';
                if (this.finish != null) {
                    spanStartFinish.appendChild(document.createElement('br'));
                    var spanFinish = document.createElement('span');
                    spanFinish.innerText = this.finish;
                    spanStartFinish.appendChild(spanFinish);
                }
            }
            else if (this.finish != null) {
                var spanFinish = document.createElement('span');
                spanFinish.innerText = this.finish;
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

function initializeVNList() {
    loadJSON('data/vnlist.json', initializeVNListJson);
}

function initializeVNListJson(jsonText) {
    var json = JSON.parse(stripJsonComments(jsonText));
    var table = document.getElementById('list-table');

    var list = [];
    loadStatus(json, 'playing', list);
    loadStatus(json, 'completed', list);
    loadStatus(json, 'onhold', list);
    loadStatus(json, 'dropped', list);
    loadStatus(json, 'planning', list);
    
    for (var i = 0; i < list.length; i++)
        table.appendChild(list[i].buildTableSection(i + 1));
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
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function loadStatus(json, status, list) {
    statusArray = json[status];
    if (statusArray == null)
        return;

    var statusList = [];
    for (var i = 0; i < statusArray.length; i++) {
        statusList.push(new VNEntry(statusArray[i], status));
    }
    statusList.sort(function (a, b) { return a.title.toLowerCase().localeCompare(b.title.toLowerCase()) });
    Array.prototype.push.apply(list, statusList);
}
