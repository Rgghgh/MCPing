import sys
from mcstatus import MinecraftServer
try:
    status = MinecraftServer.lookup(sys.argv[1]).status()
    print status.favicon
except Exception, e:
    print 'None'
    pass
