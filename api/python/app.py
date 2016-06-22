#!/usr/bin/env python
import sys
from mcstatus import MinecraftServer


def player_list(to_parse):
    players = []
    for val in to_parse:
        players.append({'name': str(val.name), 'id': str(val.id)})
    return players

try:
    status = MinecraftServer.lookup(sys.argv[1]).status()

    data = {
        'status':'online',
        'latency': status.latency,
        'players': {
            'max': status.players.max,
            'online': status.players.online,
            'list': player_list(status.players.sample)
        },
        'version': str(status.version.name)
    }

    print data
except Exception:
    print {'status': 'offline'}
    pass
