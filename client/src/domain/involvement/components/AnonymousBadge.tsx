import { useEffect, useState } from 'react';

import { Tag } from 'antd';

import { hasServiceError } from '@domain/@shared/service.helper';

import { listInvolvements } from '../api/list-involvements.service';

type Props = { recordId: number };

export function AnonymousBadge({ recordId }: Props) {
    const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);

    useEffect(() => {
        const fetch = async () => {
            const response = await listInvolvements(recordId);

            if (hasServiceError(response)) return;

            setIsAnonymous(response.data.is_anonymous);
        };

        fetch();
    }, [recordId]);

    if (isAnonymous === null) return null;

    return isAnonymous
        ? <Tag color="warning">Anônimo</Tag>
        : <Tag color="success">Identificado</Tag>;
}
