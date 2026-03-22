/**
 * Sovereign Community Library Engine
 * Manages vast collections of user-created AI characters, personas, and narrative scenarios.
 * Provides a robust substrate for sharing templates, prompts, and roleplaying tips locally.
 */
import { AICharacter, characterStreamEngine } from './characterStreamEngine';

export interface CommunityTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  author: string;
}

class CommunityLibraryEngine {
  private publicCharacters: AICharacter[] = [];
  private templates: CommunityTemplate[] = [];

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates() {
    this.templates = [
      {
        id: 'tpl-1',
        title: 'Cyberpunk Noir',
        description: 'A gritty, futuristic detective persona template.',
        prompt: 'Create a cynical AI detective in a rain-slicked neon city.',
        category: 'Roleplay',
        author: 'Sovereign-Admin'
      },
      {
        id: 'tpl-2',
        title: 'High Fantasy Sage',
        description: 'A wise, ancient wizard persona template.',
        prompt: 'Create a powerful AI wizard who speaks in riddles and ancient lore.',
        category: 'Fantasy',
        author: 'Neural-Muse'
      }
    ];
  }

  /**
   * Publishes a character to the community library.
   */
  public publishCharacter(characterId: string) {
    const character = characterStreamEngine.getCharacter(characterId);
    if (character) {
      character.isPublic = true;
      if (!this.publicCharacters.find(c => c.id === character.id)) {
        this.publicCharacters.push(character);
      }
    }
  }

  /**
   * Retrieves all public characters from the library.
   */
  public getPublicCharacters(): AICharacter[] {
    return this.publicCharacters;
  }

  /**
   * Retrieves community-shared templates.
   */
  public getTemplates(): CommunityTemplate[] {
    return this.templates;
  }

  /**
   * Adds a new template to the community hub.
   */
  public shareTemplate(template: CommunityTemplate) {
    this.templates.push(template);
  }
}

export const communityLibraryEngine = new CommunityLibraryEngine();
