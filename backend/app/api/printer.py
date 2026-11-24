from fastapi import APIRouter, HTTPException, Depends, status
from pysnmp.hlapi.v3arch.asyncio import (
    SnmpEngine, CommunityData, UdpTransportTarget, ContextData,
    ObjectType, ObjectIdentity, walk_cmd
)
import asyncio

router = APIRouter(prefix="/printer", tags=["Printer"])

printers = [
    {"id":"170_printer", "name":"170 Printer", "ip":"10.38.1.170"},
    {"id":"119_printer", "name":"119 Printer", "ip":"10.38.1.119"},
]

async def fetch_snmp(printer_ip: str):
    snmp_engine = SnmpEngine()

    auth_data = CommunityData('public', mpModel=0)
    transport_target = await UdpTransportTarget.create((printer_ip, 161), timeout=1.0, retries=0)
    context = ContextData()

    oid_desc = ObjectType(ObjectIdentity('1.3.6.1.2.1.43.11.1.1.6'))
    oid_level = ObjectType(ObjectIdentity('1.3.6.1.2.1.43.11.1.1.9'))

    descriptions = []
    levels = []

    try:
        async for (errorIndication, errorStatus, errorIndex, varBinds) in walk_cmd(
            snmp_engine, auth_data, transport_target, context, oid_desc, lexicographicMode=False
        ):
            if not errorIndication and not errorStatus:
                for varBind in varBinds:
                    descriptions.append(str(varBind[1]))

        async for (errorIndication, errorStatus, errorIndex, varBinds) in walk_cmd(
            snmp_engine, auth_data, transport_target, context, oid_level, lexicographicMode=False
        ):
            if not errorIndication and not errorStatus:
                for varBind in varBinds:
                    val = str(varBind[1])
                    if val.isdigit() and int(val) >= 0:
                        levels.append(int(val))

                    else:
                        levels.append(0)


        result = {}

        for desc, level in zip(descriptions, levels):
            if desc and desc != "1.3.6.1.2.1.43.11.1.1.6":
                result[desc] = level
        return result

    except Exception as e:
        return {"error": "Printer offline or unreachable"}

@router.get("/ink")
async def get_ink():
    results = []

    for printer in printers:
        ink = await fetch_snmp(printer["ip"])

        results.append({
            "id": printer["id"],
            "name": printer["name"],
            "data": ink
        })

    return results
