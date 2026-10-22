import { Navigate, useParams } from 'react-router'
import { featureById } from '../../data/features'
import { WORKSPACES } from '../../data/workspaces'
import { ToolWorkspace } from '../../components/app/ToolWorkspace'
import { ChatWorkspace } from '../../components/app/ChatWorkspace'

export default function FeaturePage() {
  const { featureId } = useParams()
  const feature = featureById(featureId)
  if (!feature) return <Navigate to="/app" replace />
  if (feature.id === 'chat') return <ChatWorkspace feature={feature} />
  return <ToolWorkspace key={feature.id} feature={feature} config={WORKSPACES[feature.id]} />
}
