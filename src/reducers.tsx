import { Theme } from './models'

export const defaultAddTaskValuesReducer = (
  state: { proj: string; desc: string; extId: string },
  action: any,
) => {
  switch (action.type) {
    case 'setProj':
      return { ...state, proj: action.value }
    case 'setDesc':
      return { ...state, desc: action.value }
    case 'setExtId':
      return { ...state, extId: action.value }
    case 'reset':
      return { proj: '', desc: '', extId: '' }
  }
  return state
}

export const themeReducer = (state: Theme, action: any) => {
  switch (action.type) {
    case 'setColors':
      return {
        ...state,
        primary: action.primary,
        secondary: action.secondary,
      }
    case 'previewPrimary':
      return {
        ...state,
        primaryPreview: action.primary,
      }
    case 'previewSecondary':
      return {
        ...state,
        secondaryPreview: action.secondary,
      }
    case 'cancelPreview':
      return { ...state, primaryPreview: null, secondaryPreview: null }
  }
  return state
}
