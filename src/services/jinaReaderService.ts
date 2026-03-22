/**
 * Jina Reader Service
 * Converts any URL into a format suitable for Large Language Models (LLM) using r.jina.ai.
 */
export class JinaReaderService {
  private static readonly BASE_URL = 'https://r.jina.ai/';

  /**
   * Reads the content of a URL and converts it to LLM-friendly markdown.
   */
  public static async readUrl(url: string): Promise<string> {
    console.log(`[JINA_READER] Reading URL: ${url}`);
    try {
      const targetUrl = `${this.BASE_URL}${url}`;
      const response = await fetch(targetUrl);
      
      if (!response.ok) {
        throw new Error(`Jina Reader failed with status: ${response.status}`);
      }

      const content = await response.text();
      return content;
    } catch (error) {
      console.error('[JINA_READER] Error reading URL:', error);
      throw error;
    }
  }
}

export const jinaReaderService = JinaReaderService;
