import type { useAppProps } from 'antd/es/app/context';

import type { Service } from '@domain/@shared/service.type';

export type MakeMessage = (response: Service.ServerException) => string | null;

const ERROR_TRANSLATIONS: Record<string, string> = {
    'The CPF has already been taken.': 'Este CPF já está cadastrado no sistema.',
    'The email has already been taken.': 'Este e-mail já está cadastrado no sistema.',
    'The name field is required.': 'O campo nome é obrigatório.',
    'The cpf field is required.': 'O campo CPF é obrigatório.',
    'The email field is required.': 'O campo e-mail é obrigatório.',
    'The birth_date field is required.': 'O campo data de nascimento é obrigatório.',
    'The cpf must be 11 characters.': 'O CPF deve ter 11 dígitos.',
    'The person_id field is required.': 'O campo pessoa é obrigatório.',
    'The type field is required.': 'O campo tipo é obrigatório.',
    'This person is already involved in this record.': 'Esta pessoa já está vinculada a este relato.',
    'Person not found.': 'Pessoa não encontrada.',
    'Record not found.': 'Relato não encontrado.',
    'Company not found.': 'Empresa não encontrada.',
    'Involvement not found.': 'Envolvimento não encontrado.',
    'Resource not found.': 'Recurso não encontrado.',
    'Resource already exists.': 'Este recurso já existe.',
    'Bad request.': 'Requisição inválida.',
    'Internal server error.': 'Erro interno do servidor.',
};

function translateError(message: string): string {
    return ERROR_TRANSLATIONS[message] ?? message;
}

export function hasServiceError(response: Service.DefaultResponse | Service.ExceptionResponse): response is Service.ExceptionResponse {
    if (response instanceof Error)
        return true;

    if ('error' in response)
        return true;

    return false;
}

/** @warning Depends on React and Antd! */
export function handleServiceError({ notification }: useAppProps, response: Service.ExceptionResponse, makeMessage?: MakeMessage): void {
    console.log('%cA service error has been detected!', 'background-color: #871f1f; color: white');

    if (response instanceof Error)
        return notification.error({ message: 'Algo deu errado!', description: response.message });

    const description = makeMessage?.(response) ?? translateError(response.error.description);

    notification.error({ message: 'Algo deu errado!', description });
}
