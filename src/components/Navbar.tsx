import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName } from '@fortawesome/fontawesome-svg-core'
import { Dialog, DialogBackdrop, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import toast, { Toaster } from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'

import siteConfig from '../../config/site.config'
import SearchModal from './SearchModal'
import useDeviceOS from '../utils/useDeviceOS'

const Navbar = () => {
  const router = useRouter()
  const os = useDeviceOS()

  const [tokenPresent, setTokenPresent] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [searchOpen, setSearchOpen] = useState(false)
  const openSearchBox = () => setSearchOpen(true)

  useHotkeys(`${os === 'mac' ? 'meta' : 'ctrl'}+k`, e => {
    openSearchBox()
    e.preventDefault()
  })

  useEffect(() => {
    const storedToken = () => {
      for (const r of siteConfig.protectedRoutes) {
        if (localStorage.hasOwnProperty(`opt-auth-token-${encodeURIComponent(r)}`)) {
          return true
        }
      }
      return false
    }
    setTokenPresent(storedToken())
  }, [])

  const clearTokens = () => {
    setIsOpen(false)

    siteConfig.protectedRoutes.forEach(r => {
      localStorage.removeItem(`opt-auth-token-${encodeURIComponent(r)}`)
      localStorage.removeItem(`opt-auth-pass-${encodeURIComponent(r)}`)
    })

    toast.success('Cleared all tokens')
    setTimeout(() => {
      router.reload()
    }, 1000)
  }

  return (
    <div className="sticky top-0 z-[100] border-b border-gray-900/10 bg-white/80 backdrop-blur-sm dark:border-gray-500/30 dark:bg-gray-900/80">
      <Toaster />

      <SearchModal searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

      <div className="mx-auto flex w-full items-center justify-between space-x-4 px-4 py-1">
        <Link href="/" passHref className="flex items-center space-x-2 py-2 hover:opacity-80 md:p-2 dark:text-white">
          <Image src={siteConfig.icon} alt="icon" width="25" height="25" priority />
          <span className="hidden font-bold sm:block">{siteConfig.title}</span>
        </Link>

        <div className="flex flex-1 items-center space-x-4 text-gray-700 md:flex-initial">
          <button
            className="flex flex-1 items-center justify-between rounded-lg bg-gray-100 px-2.5 py-1.5 hover:opacity-80 md:w-48 dark:bg-gray-800 dark:text-white"
            onClick={openSearchBox}
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon className="h-4 w-4" icon="search" />
              <span className="truncate text-sm font-medium">{'Search ...'}</span>
            </div>

            <div className="hidden items-center space-x-1 md:flex">
              <div className="rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium dark:bg-gray-700">
                {os === 'mac' ? '⌘' : 'Ctrl'}
              </div>
              <div className="rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium dark:bg-gray-700">K</div>
            </div>
          </button>

          {siteConfig.links.length !== 0 &&
            siteConfig.links.map((l: { name: string; link: string }) => (
              <a
                key={l.name}
                href={l.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-80 dark:text-white"
              >
                <FontAwesomeIcon icon={['fab', l.name.toLowerCase() as IconName]} />
                <span className="hidden text-sm font-medium md:inline-block">{l.name}</span>
              </a>
            ))}

          {siteConfig.email && (
            <a href={siteConfig.email} className="flex items-center space-x-2 hover:opacity-80 dark:text-white">
              <FontAwesomeIcon icon={['far', 'envelope']} />
              <span className="hidden text-sm font-medium md:inline-block">{'Email'}</span>
            </a>
          )}

          {tokenPresent && (
            <button
              className="flex items-center space-x-2 hover:opacity-80 dark:text-white"
              onClick={() => setIsOpen(true)}
            >
              <span className="hidden text-sm font-medium md:inline-block">{'Logout'}</span>
              <FontAwesomeIcon icon="sign-out-alt" />
            </button>
          )}
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[150] overflow-y-auto"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="flex min-h-screen items-center justify-center px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
            </TransitionChild>

            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative z-[160] inline-block w-full max-w-md overflow-hidden rounded-2xl bg-white/80 shadow-lg transition-all dark:bg-gray-900/80">
                <div className="p-6 text-left">
                  <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {'Clear all tokens?'}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {'These tokens are used to authenticate yourself into password protected folders, ' +
                        'clearing them means that you will need to re-enter the passwords again.'}
                    </p>
                  </div>

                  <div className="mt-4 max-h-32 overflow-y-scroll font-mono text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 dark:text-gray-100 dark:scrollbar-thumb-gray-700 dark:hover:scrollbar-thumb-gray-600">
                    {siteConfig.protectedRoutes.map((r, i) => (
                      <div key={i} className="flex items-center space-x-1">
                        <FontAwesomeIcon icon="key" />
                        <span className="truncate">{r}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-end space-x-3">
                    <button
                      className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {'Cancel'}
                    </button>
                    <button
                      className="inline-flex items-center justify-center space-x-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={() => clearTokens()}
                    >
                      <FontAwesomeIcon icon={['far', 'trash-alt']} />
                      <span>{'Clear all'}</span>
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default Navbar
