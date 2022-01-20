import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
import Eth from "@ledgerhq/hw-app-eth"
import Error from "@ledgerhq/errors"
import { SignedEVMTransaction } from "../../networks"
import { HexString } from "../../types"
import BaseService from "../base"
import { ServiceCreatorFunction, ServiceLifecycleEvents } from "../types"
import logger from "../../lib/logger"

enum LedgerType {
  LEDGER_NANO_S,
  LEDGER_NANO_X,
}

// 0x1011 - LEDGER_NANO_S_DASHBOARD
// 0x1015 - LEDGER_NANO_S_ETH_APP

const SupportedLedgerPids = {
  0x1011: LedgerType.LEDGER_NANO_S, // DASHBOARD
  0x1015: LedgerType.LEDGER_NANO_S, // ETHEREUM APP
}

type MetaData = {
  ethereumVersion: string
}

type Events = ServiceLifecycleEvents & {
  ledgerAdded: {
    id: string
    type: LedgerType
    accountIDs: string[]
    metadata: MetaData
  }
  ledgerAccountAdded: {
    id: string
    ledgerID: string
    derivationPath: string
    addresses: HexString[]
  }
  connected: { id: string; type: LedgerType }
  disconnected: { id: string; type: LedgerType }
  address: { ledgerID: string; derivationPath: string; address: HexString }
  signedTransaction: SignedEVMTransaction
}

/**
 * The LedgerService is responsible for
 *
 * The main purpose for this service/layer is
 *
 * The responsibility of this service is 2 fold.
 * - xxx
 */
export default class LedgerService extends BaseService<Events> {
  knownLedgerInstances: Array<string>

  static create: ServiceCreatorFunction<
    Events,
    LedgerService,
    [] // we don't know our final dependencies
  > = async () => {
    logger.info("LedgerService::create")
    return new this()
  }

  private constructor() {
    super()
    this.knownLedgerInstances = ["unrecognizable"]
    logger.info("LedgerService::constructor")
  }

  private async generateLedgerId(
    event: USBConnectionEvent
  ): Promise<[string, LedgerType]> {
    return [this.knownLedgerInstances[0], LedgerType.LEDGER_NANO_S]
  }

  protected async internalStartService(): Promise<void> {
    await super.internalStartService() // Not needed, but better to stick to the patterns

    logger.info("LedgerService::internalStartService")

    navigator.usb.addEventListener(
      "connect",
      async (event: USBConnectionEvent) => {
        // how to make it removable?
        if (
          Object.keys(SupportedLedgerPids).includes(
            String(event.device.productId)
          )
        ) {
          const transport = await TransportWebUSB.create()

          logger.info("Handled & authorized device connected!")
          const [id, type] = await this.generateLedgerId(event)

          this.emitter.emit("connected", { id, type })
          if (id === this.knownLedgerInstances[0]) {
            logger.info("This Ledger does not run the Ethereum app currently!")
            try {
              // openApp(transport, "Ethereum"); // <- Shall we do that? If user does it, it will result in another call in this handler!
            } catch (err) {
              // if (err.name === "TransportOpenUserCancelled") // <- how to handle this specific case?
            } finally {
              if (transport) await transport.close()
            }
          } else {
            const ethereumAppHandle = new Eth(transport)
            const conf = await ethereumAppHandle.getAppConfiguration()
            this.emitter.emit("ledgerAdded", {
              id,
              type,
              accountIDs: [],
              metadata: { ethereumVersion: conf.version },
            })
          }
        } else {
          logger.info("Unknown dev")
        }
        // navigator.usb.removeEventListener('connect', transient_cb); // how?
      }
    )
  }
}
