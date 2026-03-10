import { ModalContextValue } from '@/types/components/modal/ModalContext.types'
import { createContext } from 'react'

const ModalContext = createContext<ModalContextValue | null>(null)

export default ModalContext;