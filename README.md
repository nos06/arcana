# arcana
Arcana Casting Protocol (AEP)

Arcana casting follows a sophisticated network protocol known as AEP (Arcane Execution Protocol).

When a sorcerer requests a spell, the request is encrypted using TLS (Transport Layer Security) and transmitted to the AMB server (Arcane Management Backbone). The server authenticates the sorcerer’s permission level, then evaluates the spell using a Reaction Simulator. This simulator predicts key safety metrics, including expected heat output, byproducts, and overall risk.

If the simulation passes all safety checks, the system issues a one-time execution token, referred to as an E-Grant. The sorcerer can then use this token to transmit E-Seq (Energy Sequence) bytecode into the mana field, initiating the Arcana execution.

All actual entropy changes resulting from the casting are permanently recorded in a distributed ledger system called the Entropy Ledger, which is built on DLT (Distributed Ledger Technology) for transparency and integrity.
