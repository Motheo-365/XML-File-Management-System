import { reactive } from "vue"

let messageInstance = null
let confirmInstance = null

export function setMessageInstance(instance) {
  messageInstance = instance
}

export function setConfirmInstance(instance) {
  confirmInstance = instance
}

export function $toast(text, type = "info") {
  messageInstance?.show(text, type)
}

export function $confirm({ title = "Confirm", message = "Are you sure?" } = {}) {
  return confirmInstance?.open({ title, message })
}