/// <reference path="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js" />
/// <reference path="jquery.cookie.js" />
/// <reference path="AppCode.js" />

function genServerHTML(index) {
    var gen = "";
    gen += '<h1>' + servers[index]["name"] + '</h1>';
    gen += '<div class="favicon" style="width:64px; height:64px;"></div>';
    gen += '<div class="motd">Pinging...</div>';
    gen += '<div class="players"></div>';
    gen += '<label for="' + index + '" class="playersList"></label>';
    gen += '<div class="version"></div>';
    gen += '<div class="actionBar">';
    gen += '    <button class="option removeServer" value="' + index + '"></button>';
    gen += '    <button class="option openEdit" value="' + index + '"></button>';
    gen += '    <button class="option openShare" value="' + document.URL + "?" + servers[index]["name"] + ";" + servers[index]["ip"] + '"></button>';
    if (servers[index]['notif'] == 0)
        gen += '<button class="option toggleNotif off" value="' + index + '"></button>';
    else
        gen += '<button class="option toggleNotif on" value="' + index + '"></button>';
    gen += '    <button class="option refresh" value="' + index + '"></button>';
    gen += '</div>';

    return gen;
}

function resetServer(index) {
    $('#' + index + ' .motd').html("Pinging...");
    $('#' + index + ' .players').html("");
    $('#' + index + ' .playersList').html("");
    $('#' + index).removeClass('open');
    $('#' + index).removeClass('closed');

    servers["" + index]['properties'] = undefined;
}

function showLabel(index) {
    $('label[for="' + index + '"]').show();
    $('label[for="' + index + '"]').addClass("follow");
}

function hideLabel(index) {
    $('label[for="' + index + '"]').hide();
    $('label[for="' + index + '"]').removeClass("follow");
}

function addServer(name, ip) {
    count++;
    $.cookie('count', count);
    $.cookie("serverName" + count, name);
    $.cookie("serverIP" + count, ip);
    $.cookie("serverNotif" + count, 0);
    location.reload(true);
}


function removeServer(index, reload) {
    $.removeCookie('serverName' + index);
    $.removeCookie('serverIP' + index);
    $.removeCookie('serverNotif' + index);
    if (reload)
        location.reload(true);
}

function edit(index) {
    var serverName = $('#editName').val();
    var serverIP = $('#editIP').val();
    $.cookie('serverName' + index, serverName);
    $.cookie('serverIP' + index, serverIP);
    location.reload(true);
}

// ------ NOTIFICATION -------- //

function notify(msg, options) {
    if (!Notification) {
        alert('Notifications are supported in modern versions of Chrome, Firefox, Opera and Firefox.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();

    var icon = 'http://mutepackgenerator.webege.com/res/ping.png';
    if (options != undefined)
        icon = options["icon"];

    var notification = new Notification('Minecraft Server Ping!', {
        icon: icon,
        body: msg
    });

    notification.onclick = function () {
        window.open(document.location);
    };
}

function colorForamtting(str) {
    var sp = str.split('§');
    var gen = sp[0];
    var end = "";
    for (i = 1; i < sp.length; i++) {
        gen += "<span class='cf" + sp[i].charAt(0) + "'>";
        gen += sp[i].substring(1);
        end += "</span>";
    }
    gen.replace("\n", "</br>");
    gen += end;

    return gen;
}

// ------ PING -------- //

var mcping = "./api/";
var mcfav = "https://mcapi.ca/query/";
var playerHead = "https://crafatar.com/avatars/";

function pingall() {
    for (var index in servers)
        ping("" + index);
}

function ping(index, prev) {
    var url = mcping + servers[index]['ip'];
    if (servers[index]['address'] != undefined)
        url = mcping + servers[index]['address'] + "/" + servers[index]['port'];

    $.get(url, function (data) {
        data = JSON.parse(data.replace(/'/g,'"'));
        if (data['status'] == 'online') {
            var players = {};
            playersRaw = data["players"]["list"];
            for (var x in playersRaw) {
                players["" + playersRaw[x]['name']] = {
                    "name": playersRaw[x]['name'],
                    "icon": playerHead + playersRaw[x]['name']
                };
            }

            servers[index]['properties'] = {
                "version": data['version'],
                "online": data['players']['online'],
                "max": data['players']['max'],
                "motd": "motd",
                "players": players,
                "favicon": mcfav + servers[index]['ip'] + "/icon"
            };
        }

        translate(index);
        if (prev !== undefined)
            update(index, prev);
    });
}


function translate(index) {
    if (servers[index]['properties'] == undefined) {
        $("#" + index + " .motd").html("server offline.");
        $("#" + index + " .playersList").html("Server Empty.");
        $("#" + index).addClass("closed");
        return;
    }

    $("#" + index).addClass("open");
    $("#" + index + " .favicon").css("background-image", "url(" + servers[index]['properties']['favicon'] + ")");
    $("#" + index + " .motd").html("" + colorForamtting(servers[index]['properties']['motd']));
    $("#" + index + " .players").html("" + servers[index]['properties']['online'] + " / " + servers[index]['properties']['max']);
    $("#" + index + " .version").html("" + servers[index]['properties']['version']);

    var gen = "<table>";
    for (var x in servers[index]['properties']['players']) {
        gen += "<tr>";
        gen += "<td><img width='40px' src='" + servers[index]['properties']['players'][x]['icon'] + "'/></td>";
        gen += "<td>" + servers[index]['properties']['players'][x]['name'] + "</td>";
        gen += "</tr>";
    }
    gen += "</table>";

    if (gen === "<table></table>")
        gen = "Server Empty.";

    $("#" + index + " .playersList").html("" + gen);
}