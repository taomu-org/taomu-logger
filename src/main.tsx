import React from 'react'
import { createRoot } from 'react-dom/client'

import 'atomic-cls'

import Demo from './demo'

createRoot(document.getElementById('app')!).render(<Demo />)
