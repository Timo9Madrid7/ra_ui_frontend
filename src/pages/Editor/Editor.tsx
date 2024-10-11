import { FC } from 'react';

import { Editor } from '@/components';
import { ResultsProvider } from '@/components';
import { SimulationProvider } from '@/context/SimulationContext';
import { MeshProvider } from '@/context/MeshContext';
import { ModelProvider } from '@/context/ModelContext';
import { EditorProvider } from '@/context/EditorContext';
import { MaterialPanelProvider } from '@/components';

type EditorPageProps = {
  showResults?: boolean;
  showAuralizer?: boolean;
};

export const EditorPage: FC<EditorPageProps> = ({ showResults = false}) => {
  return (
    <EditorProvider>
      <ModelProvider>
        <SimulationProvider>
          <MaterialPanelProvider>
            <MeshProvider>
              <ResultsProvider isInResultsMode={showResults}>
                <Editor showResults={showResults} />
              </ResultsProvider>
            </MeshProvider>
          </MaterialPanelProvider>
        </SimulationProvider>
      </ModelProvider>
    </EditorProvider>
  );
};
