#!/usr/bin/env python
import sys
from mcstatus import MinecraftServer


def player_list(to_parse):
    players = ""
    try:
        for val in to_parse:
            players += '{"name": "' + str(val.name) + '", "id": "' + str(val.id) + '"},'
        players = players[:-1]
    except Exception:
        pass
    return players


def motd(to_parse):
    return str(to_parse)


try:
    status = MinecraftServer.lookup(sys.argv[1]).status()

    print '{"status": "online","latency": ' + str(status.latency) + ',"motd": "' + motd(status.description) + '","players": {"max": ' + str(status.players.max) + ',"online": ' + str(status.players.online) + ',"list": [' + player_list(status.players.sample) + ']},"version": "' + str(status.version.name) + '"}'
except Exception, e:
    print '{"status": "offline", "error": "' + str(e) + '","src":"b"}'
    pass
