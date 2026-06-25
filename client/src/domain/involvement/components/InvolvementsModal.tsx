import { useCallback, useEffect, useState } from 'react';

import {
    App,
    Button,
    Divider,
    Form,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';
import { listPeople } from '@domain/person/api/list-people.service';
import type { Person } from '@domain/person/person.type';

import { createInvolvement } from '../api/create-involvement.service';
import { deleteInvolvement } from '../api/delete-involvement.service';
import { listInvolvements } from '../api/list-involvements.service';
import type { Involvement } from '../involvement.type';

const TYPE_LABELS: Record<Involvement.Type, string> = {
    whistleblower: 'Relatante',
    witness: 'Testemunha',
    victim: 'Vítima',
    denounced: 'Denunciado',
};

const TYPE_COLORS: Record<Involvement.Type, string> = {
    whistleblower: 'blue',
    witness: 'cyan',
    victim: 'orange',
    denounced: 'red',
};

type Props = {
    recordId: number;
    onClose: () => void;
};

type FormValues = {
    person_id: number;
    type: Involvement.Type;
};

export function InvolvementsModal({ recordId, onClose }: Props) {
    const [involvements, setInvolvements] = useState<Involvement.Model[]>([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [people, setPeople] = useState<Person.Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const [form] = Form.useForm<FormValues>();
    const app = App.useApp();

    const fetchInvolvements = useCallback(async () => {
        setIsLoading(true);

        const response = await listInvolvements(recordId);

        setIsLoading(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        setInvolvements(response.data.involvements);
        setIsAnonymous(response.data.is_anonymous);
    }, [recordId, app]);

    const fetchPeople = useCallback(async () => {
        const response = await listPeople();

        if (hasServiceError(response))
            return handleServiceError(app, response);

        setPeople(response.data.people);
    }, [app]);

    useEffect(() => {
        fetchInvolvements();
        fetchPeople();
    }, [fetchInvolvements, fetchPeople]);

    const onFinish = async (values: FormValues) => {
        setIsSending(true);

        const response = await createInvolvement(recordId, values);

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        form.resetFields();
        fetchInvolvements();
    };

    const handleDelete = async (involvementId: number) => {
        const response = await deleteInvolvement(recordId, involvementId);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        fetchInvolvements();
    };

    const columns = [
        {
            title: 'Pessoa',
            dataIndex: ['person', 'name'],
        },
        {
            title: 'CPF',
            dataIndex: ['person', 'cpf'],
            render: (value: string) =>
                value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            render: (value: Involvement.Type) => (
                <Tag color={TYPE_COLORS[value]}>
                    {TYPE_LABELS[value]}
                </Tag>
            ),
        },
        {
            title: '',
            render: (_: unknown, record: Involvement.Model) => (
                <Popconfirm
                    title="Remover envolvido"
                    description="Tem certeza que deseja remover este envolvido?"
                    placement="left"
                    cancelText="Não"
                    okText="Sim"
                    okType="danger"
                    onConfirm={() => handleDelete(record.id)}
                >
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        title="Remover"
                        danger
                    />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Modal
            open
            title={`Envolvidos do relato #${recordId}`}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            {isAnonymous && (
                <Tag color="warning" style={{ marginBottom: 16 }}>
                    Relato anônimo — nenhum relatante vinculado
                </Tag>
            )}

            <Table
                columns={columns}
                dataSource={involvements}
                loading={isLoading}
                rowKey="id"
                size="small"
                pagination={false}
            />

            <Divider />

            <Typography.Text strong>Adicionar envolvido</Typography.Text>

            <Form
                form={form}
                onFinish={onFinish}
                layout="inline"
                style={{ marginTop: 12 }}
            >
                <Form.Item<FormValues>
                    name="person_id"
                    rules={[{ required: true, message: 'Selecione uma pessoa.' }]}
                >
                    <Select
                        placeholder="Pessoa"
                        style={{ width: 220 }}
                        showSearch
                        optionFilterProp="label"
                        options={people.map(p => ({
                            value: p.id,
                            label: `${p.name} (${p.cpf})`,
                        }))}
                    />
                </Form.Item>

                <Form.Item<FormValues>
                    name="type"
                    rules={[{ required: true, message: 'Selecione o tipo.' }]}
                >
                    <Select
                        placeholder="Tipo"
                        style={{ width: 160 }}
                        options={Object.entries(TYPE_LABELS).map(([value, label]) => ({
                            value,
                            label,
                        }))}
                    />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSending}
                        >
                            Adicionar
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}
