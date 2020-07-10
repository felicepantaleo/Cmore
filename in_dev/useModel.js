import { useEffect, useState } from 'react'

import models from './model-backend'

const useModel = (modelPath) => {
  const [model, setModel] = useState()
  useEffect(() => {
    models.load(modelPath).then((model) => {
      setModel(model)
    })
  }, [modelPath])
  return model
}

export default useModel
