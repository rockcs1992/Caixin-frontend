import { type Component } from 'solid-js';
import InstructionText from "./components/InstructionText";
import styles from './App.module.css';
import BetTable from './components/BetTable';
import PlayerDisplay from './components/PlayerDisplay';
import FirstPersonView from './components/FirstPersonView';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.container}>
        <div class={styles.firstRow}>
          <PlayerDisplay username='苏西' points={150} cards={["词语","词语","词语","词语","词语","词语"]} />
          <PlayerDisplay username='苏西' points={150} cards={["词语","词语","词语","词语","词语","词语"]} />
          <PlayerDisplay username='苏西' points={150} cards={["词语","词语","词语","词语","词语","词语"]} />
        </div>
        <div class={styles.secondRow}>
          <PlayerDisplay username='苏西' points={150} cards={["词语","词语","词语","词语","词语","词语"]} />
          <PlayerDisplay username='苏西' points={150} cards={["词语","词语","词语","词语","词语","词语"]} />
        </div>
        <div class={styles.secondRow}>
          <PlayerDisplay username='苏西' points={150} cards={["词语","词语","词语","词语","词语","词语"]} />
          <PlayerDisplay username='苏西' points={150} cards={["词语","词语","词语","词语","词语","词语"]} />
        </div>
        <BetTable />
        <InstructionText />
        <FirstPersonView points={150} cards={["词语","词语","词语","词语","词语","词语"]}></FirstPersonView>
      </header>
    </div>
  );
};

export default App;
