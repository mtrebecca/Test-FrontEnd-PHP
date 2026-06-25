import { useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';
import dayjs from 'dayjs';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';

import { createPerson } from '../api/create-person.service';
import { usePeopleContext } from '../People.context';
import { PersonFields, type Values } from './PersonFields';

export function CreatePersonModal() {
    const [isSending, setIsSending] = useState(false);

    const { setIsCreateModalVisible, fetchPeople } = usePeopleContext();

    const [form] = Form.useForm<Values>();

    const app = App.useApp();

    const close = () => setIsCreateModalVisible(false);

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const response = await createPerson({
            ...values,
            birth_date: dayjs(values.birth_date).format('YYYY-MM-DD'),
        });

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        close();
        fetchPeople();
    };

    return (
        <Modal
            open
            title="Cadastrar pessoa"
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Cadastrar"
            onCancel={close}
            cancelText="Cancelar"
        >
            <Divider />

            <Form
                form={form}
                onFinish={onFinish}
                name="createPerson"
                layout="vertical"
                autoComplete="off"
            >
                <PersonFields />
            </Form>
        </Modal>
    );
}
