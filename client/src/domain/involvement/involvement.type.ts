import type { Person } from '@domain/person/person.type';

export namespace Involvement {
    export type Type = 'whistleblower' | 'witness' | 'victim' | 'denounced';

    export type Model = {
        id: number;
        type: Type;
        record_id: number;
        person_id: number;
        created_at: string;
        updated_at: string | null;
        deleted_at: string | null;
        person: Person.Model;
    };

    export type ListResponse = {
        involvements: Model[];
        is_anonymous: boolean;
    };
}
