interface ProposerSource {
  proposingEntity?: string | null;
  proposerName?: string | null;
}

/** 與議案列表卡片一致的提案者顯示文字 */
export function formatProposer(bill: ProposerSource): string {
  const entity = bill.proposingEntity ?? '';
  const name = bill.proposerName ?? '';
  if (entity === '本會議員') return `本會${name}議員`;
  if (entity === '本會議長') return `本會${name}議長`;
  return entity;
}
