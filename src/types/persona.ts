export type PersonaId = 'persona_groceries' | 'persona_snacks' | 'persona_coldstart';

export interface PersonaProfile {
  id: PersonaId;
  name: string;
  role: string;
  avatar: string;
  description: string;
  preferredCategories: string[];
  intent: string;
}
