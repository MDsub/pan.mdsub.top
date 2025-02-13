import { Dispatch, Fragment, SetStateAction, useRef, useState } from 'react'
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Switch,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useClipboard } from 'use-clipboard-copy'

import siteConfig from '../../config/site.config'
import { getBaseUrl } from '../utils/getBaseUrl'
import { getStoredToken } from '../utils/protectedRouteHandler'
import { getReadablePath } from '../utils/getReadablePath'

function LinkContainer({ title, value }: { title: string; value: string }) {
  const clipboard = useClipboard({ copiedTimeout: 1000 })
  return (
    <div className="mt-4">
      <h4 className="text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">{title}</h4>
      <div className="group relative mt-2 rounded-xl border border-gray-200/50 bg-white/50 p-3 font-mono dark:border-gray-700/50 dark:bg-gray-700/50">
        <div className="break-all pr-8 text-sm text-gray-600 dark:text-gray-300">{value}</div>
        <button
          onClick={() => clipboard.copy(value)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-gray-200/50 bg-white/80 p-1.5 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-800/80 dark:hover:bg-gray-700/80"
        >
          {clipboard.copied ? (
            <FontAwesomeIcon icon="check" className="h-4 w-4 text-green-500" />
          ) : (
            <FontAwesomeIcon icon="copy" className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
    </div>
  )
}

export default function CustomEmbedLinkMenu({
  path,
  menuOpen,
  setMenuOpen,
}: {
  path: string
  menuOpen: boolean
  setMenuOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [_, token] = getStoredToken(path)

  // Focus on input automatically when menu modal opens
  const focusInputRef = useRef<HTMLInputElement>(null)
  const closeMenu = () => setMenuOpen(false)

  const readablePath = getReadablePath(path)
  const filename = readablePath.substring(readablePath.lastIndexOf('/') + 1)
  const [name, setName] = useState(filename)
  const [proxy, setProxy] = useState(false)

  return (
    <Transition appear show={menuOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[200] overflow-y-auto"
        onClose={closeMenu}
        initialFocus={focusInputRef}
      >
        <div className="min-h-screen px-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm dark:bg-black/50" />
          </TransitionChild>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="my-8 inline-block w-full max-w-3xl transform overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 p-6 text-left align-middle shadow-lg backdrop-blur-sm transition-all dark:border-gray-700/50 dark:bg-gray-800/80">
              <DialogTitle as="h3" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {'Customise direct link'}
              </DialogTitle>

              <Description as="p" className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                <>
                  {'Change the raw file direct link to a URL ending with the extension of the file.'}{' '}
                  <a
                    href="https://efl.notion.site/Hosting-images-18bd8cf2460980b197ffc24282b8c147"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
                  >
                    {'What is this?'}
                  </a>
                </>
              </Description>

              <div className="mt-6">
                <div className="mb-6 flex items-center justify-between">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {'Proxy'}
                  </h4>

                  <Switch.Group as="div" className="flex items-center">
                    <Switch
                      checked={proxy}
                      onChange={setProxy}
                      disabled={!siteConfig.allowProxy}
                      className={`${
                        proxy ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          proxy ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </Switch.Group>
                </div>

                <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  {'Filename'}
                </h4>
                <input
                  className="mt-2 w-full rounded-xl border border-gray-200/50 bg-white/50 p-3 font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-700/50 dark:bg-gray-700/50 dark:text-white"
                  ref={focusInputRef}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />

                <LinkContainer
                  title={'Default'}
                  value={`${getBaseUrl()}/api/raw?path=${readablePath}${token ? `&odpt=${encodeURIComponent(token)}` : ''}${proxy ? '&proxy=true' : ''}`}
                />
                <LinkContainer
                  title={'URL encoded'}
                  value={`${getBaseUrl()}/api/raw?path=${path}${token ? `&odpt=${encodeURIComponent(token)}` : ''}${proxy ? '&proxy=true' : ''}`}
                />
                <LinkContainer
                  title={'Customised'}
                  value={`${getBaseUrl()}/api/name/${name}?path=${readablePath}${
                    token ? `&odpt=${encodeURIComponent(token)}` : ''
                  }${proxy ? '&proxy=true' : ''}`}
                />
                <LinkContainer
                  title={'Customised and encoded'}
                  value={`${getBaseUrl()}/api/name/${name}?path=${path}${token ? `&odpt=${encodeURIComponent(token)}` : ''}${proxy ? '&proxy=true' : ''}`}
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
