from pysnmp.hlapi.v3arch.asyncio import (
    SnmpEngine, CommunityData, UdpTransportTarget, ContextData,
    ObjectType, ObjectIdentity, walk_cmd
)
import asyncio

async def get_printer_ink(ip_address):
    print(f"Connecting to printer at {ip_address}...")

    snmp_engine = SnmpEngine()
    auth_data = CommunityData('public', mpModel=0) 
    transport_target = await UdpTransportTarget.create((ip_address, 161), timeout=2.0, retries=1)
    context = ContextData()

    # OID for Current Level (percentage)
    # 1.3.6.1.2.1.43.11.1.1.9
    oid_level = ObjectType(ObjectIdentity('1.3.6.1.2.1.43.11.1.1.9'))
    
    results = []

    try:
        # Walk the table (takes exactly 5 positional arguments in v7)
        async for (errorIndication, errorStatus, errorIndex, varBinds) in walk_cmd(
            snmp_engine, auth_data, transport_target, context, oid_level, lexicographicMode=False
        ):
            if errorIndication:
                print(f"Error: {errorIndication}")
                break
            elif errorStatus:
                print(f"Error: {errorStatus.prettyPrint()}")
                break
            else:
                for varBind in varBinds:
                    # Extract the level from the response
                    level = str(varBind[1])
                    if level.isdigit() and int(level) >= 0:
                        results.append(f"{level}%")
    except Exception as e:
        print(f"Connection error: {e}")

    if not results:
        print("Could not retrieve ink levels. Check the IP and SNMP settings.")
    else:
        print("\n--- Printer Ink Levels ---")
        for res in results:
            print(res)

# Run the test
if __name__ == "__main__":
    PRINTER_IP = "10.38.1.170" # <--- REPLACE WITH YOUR PRINTER IP
    asyncio.run(get_printer_ink(PRINTER_IP))