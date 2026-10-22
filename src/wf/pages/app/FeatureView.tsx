import { featureById, type FeatureId } from '../../data/features'
import { WORKSPACES } from '../../data/workspaces'
import { ToolWorkspace } from '../../components/app/ToolWorkspace'
import { ChatWorkspace } from '../../components/app/ChatWorkspace'

export function FeatureView({ id }: { id: FeatureId }) {
  const feature = featureById(id)!
  if (feature.id === 'chat') return <ChatWorkspace feature={feature} />
  return <ToolWorkspace key={feature.id} feature={feature} config={WORKSPACES[feature.id]} />
}
