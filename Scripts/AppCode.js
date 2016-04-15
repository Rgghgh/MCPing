/// <reference path="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js" />
/// <reference path="jquery.cookie.js" />
/// <reference path="Helper.js" />

// ------------------------------ <INIT> -------------------------------- //

var servers = {};
// servers[index] {ip, name, {properties}, notify}
// properties { version, online, max, motd, { players }, favicon }
// player { name, icon }

var count;
$.cookie.defaults = { path: '/', expires: 2555 };

$(document).ready(function () {

    count = $.cookie('count');
    if (count == undefined) {
        $.cookie('count', 0);
        count = 0;
    }

    if (count != 0)
        $('#description').hide();

    if ($.cookie('permission') != undefined) {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
        $.removeCookie('permission');
    }

    // Share

    if (location.search != "") {
        var qstring = location.search.toString().substring(1).split(';');

        if (qstring.length == 2)
            addServer(qstring[0], qstring[1]);

        location.search = "";
    }

    // Generate Page

    var gen = "";
    var actual = 0;
    if (count != 0) {
        for (var i = 1; i <= count; i++) {
            var serverName = $.cookie('serverName' + i);
            var serverIP = $.cookie('serverIP' + i);
            var notified = $.cookie('serverNotif' + i); // 0 / 1
            if (serverName != undefined) {
                servers["" + i] = {
                    "name": serverName,
                    "ip": serverIP,
                    "notif": notified
                };

                actual++;
                gen += '<div class="server" id="' + i + '">';
                gen += genServerHTML("" + i);
                gen += '</div>';
            }
        }

        if (actual == 0) {
            $.cookie('count', 0);
            location.reload();
        }

        $('#container').html(gen);

        pingall();
    }


    // ------------------------------ </INIT> -------------------------------- //

    // ------------------------------ <LISTENERS> -------------------------------- //

    // Clicks, Buttons

    $('#addServer').click(function () {
        var serverName = $('#serverName').val();
        var serverIP = $('#serverIP').val();

        if (serverName == "" || serverIP == "") {
            alert("Insert a valid name and IP.");
            return;
        }

        addServer(serverName, serverIP);
    });

    $('.removeServer').click(function () {
        removeServer(this.value, true);
    });

    $('.eatAllCookies').click(function () {
        for (var i = 1; i <= count; i++)
            removeServer(i, false);
        $.removeCookie('count');
        location.reload();
        return "Yum";
    });

    $('.refresh').click(function () {
        var index = this.value;
        rePing("" + index);
    });

    $('.openAdd').click(function () {
        $('#add').show('fade');
        $('#shader').show('fade');
    });

    $('.openShare').click(function () {
        $('#share').show('fade');
        $('#shader').show('fade');

        $('#shareLink').val(this.value);
    });

    $('.toggleNotif.off').click(function () {
        var index = this.value;
        $.cookie('serverNotif' + index, 1);
        if (Notification.permission !== "granted")
            $.cookie('permission', true);
        location.reload(true);
    });

    $('.toggleNotif.on').click(function () {
        var index = this.value;
        $.cookie('serverNotif' + index, 0);
        location.reload(true);
    });

    $('.openEdit').click(function () {
        $('#edit').show('fade');
        $('#shader').show('fade');
        var index = this.value;
        $('#editName').val($.cookie('serverName' + index));
        $('#editIP').val($.cookie('serverIP' + index));
        $('#editSave').val(index);
    });

    $('#editSave').click(function () {
        edit(this.value);
    });

    $('#edit .close').click(function () {
        $('#edit').hide('fade');
        $('#shader').hide('fade');
    });

    $('#share .close').click(function () {
        $('#share').hide('fade');
        $('#shader').hide('fade');
    });

    $('#add .close').click(function () {
        $('#add').hide('fade');
        $('#shader').hide('fade');
    });

    $('#shader').click(function () {
        $('#add').hide('fade');
        $('#shader').hide('fade');
        $('#edit').hide('fade');
        $('#share').hide('fade');
    });

    // Mouse Enters

    $('.server').mouseenter(function () {
        showLabel(this.id);
        $('#' + this.id + ' .actionBar').show('fade');
    });

    $('.server').mouseleave(function () {
        hideLabel(this.id);
        $('#' + this.id + ' .actionBar').hide('fade');
    });

    // Special

    $(window).resize(function () {
        $('#add, #edit, #share').css({
            position: 'fixed',
            left: ($(window).width() - $('#add, #edit, #share').outerWidth()) / 2,
            top: ($(window).height() - $('#add, #edit, #share').outerHeight()) / 2
        });

    });

    $(window).resize();

    $(document).mousemove(function (e) {
        $('.follow').offset({
            left: e.pageX,
            top: e.pageY + 20
        });
    });

    // ------------------------------ </LISTENERS> -------------------------------- //

    // ------------------------------ <INTERVALS> -------------------------------- //

    setInterval(function () {
        for (var x in servers)
            rePing("" + x);
    }, 300000);

    // ------------------------------ </INTERVALS> -------------------------------- // 

});

function rePing(index) {
    var prev = $.extend(true, servers[index]);
    resetServer(index);
    ping(index, prev);
}

function update(index, prev) {
    if (servers[index]['notif'] == 1) {
        var openPrev = prev['properties'] != undefined;
        var openCurr = servers[index]['properties'] != undefined;

        if (openPrev && openCurr) {
            var playersPrev = prev['properties']['players'];        
            var playersCurr = servers[index]['properties']['players'];

            for (var x in playersCurr) {
                var name = playersCurr[x]['name'];
                if (playersPrev[name] == undefined) {
                    var msg = name + " Has Joined " + servers[index]['name'];
                    var icon = playersCurr[x]['icon'];
                    notify(msg, { 'icon': icon });
                }
            }
        }

        if (openPrev && !openCurr) {
            var msg = servers[index]['name'] + " went Offline.";
            notify(msg);
        }

        if (!openPrev && openCurr) {
            var msg = servers[index]['name'] + " Is Online.";
            var icon = servers[index]['properties']['favicon'];
            notify(msg, { 'icon': icon });
        }
    }
}