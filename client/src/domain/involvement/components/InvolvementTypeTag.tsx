import { Tag } from 'antd';

import type { Involvement } from '../involvement.type';

const TYPE_CONFIG: Record<Involvement.Type, { label: string; color: string }> = {
    whistleblower: { label: 'Relatante', color: 'blue' },
    witness: { label: 'Testemunha', color: 'cyan' },
    victim: { label: 'Vítima', color: 'orange' },
    denounced: { label: 'Denunciado', color: 'red' },
};

type Props = { type: Involvement.Type };

export function InvolvementTypeTag({ type }: Props) {
    const config = TYPE_CONFIG[type];

    return <Tag color={config.color}>{config.label}</Tag>;
}
