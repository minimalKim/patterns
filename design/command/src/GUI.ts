{
  interface ICommand {
    execute(): boolean;
  }

  class Command implements ICommand {
    // sender
    app: Application;

    // receiver
    editor: Editor;
    backup: string = "";

    constructor(app: Application, editor: Editor) {
      this.app = app;
      this.editor = editor;
    }

    saveBackup() {
      this.backup = this.editor.text;
    }

    undo() {
      this.editor.text = this.backup;
    }

    // 실행 메서드는 추상화로 선언되어, 모든 Concrete Command가 자체 구현을 제공하도록 해야한다.
    // 메서드는 명령이 Editor(Receiver)의 상태를 변경하는지 여부에 따라 true, false를 반환한다.
    execute(): boolean {
      return false;
    }
  }

  // 복사
  class CopyCommand extends Command {
    execute() {
      this.app.clipboard = this.editor.getSelection();
      return false;
    }
  }

  // 잘라내기
  class CutCommand extends Command {
    execute() {
      this.saveBackup();
      this.app.clipboard = this.editor.getSelection();

      // receiver
      this.editor.deleteSelection();
      return true;
    }
  }

  // 붙여넣기
  class PasteCommand extends Command {
    execute() {
      this.saveBackup();

      // receiver
      this.editor.replaceSelection(this.app.clipboard);
      return true;
    }
  }

  // 되돌리기
  class UndoCommand extends Command {
    execute() {
      this.app.undo();
      return false;
    }
  }

  class CommandHistory {
    history: Command[] = [];

    push(command: Command) {
      this.history.push(command);
    }
    pop() {
      return this.history.pop();
    }
  }

  // receiver(수신자)의 역할을 한다. (실제 텍스트 편집작업)
  // 모든 command들은 결국 editor의 메서드에 실행을 위임한다.
  class Editor {
    text: string = "";

    getSelection() {
      // return selected text
      return "SOME SELECTED TEXT";
    }

    deleteSelection() {
      // delete selected text
    }

    replaceSelection(text: string) {
      // 클립보드의 콘텐츠를 현재 포지션에 삽입한다.
    }
  }

  class Button {
    setCommand(cb: () => void) {}
  }

  class Shortcuts {
    onKeyPress(key: string, cb: () => void) {}
  }

  // sender(발신자)의 역할을 한다.
  // 수행해야 할 작업이 있을 때 명령 개체를 만들고 실행한다.
  class Application {
    clipboard: string = "";
    editors: Editor[] = [];
    activeEditor: Editor = new Editor();
    history: CommandHistory = new CommandHistory();

    // Buttons (Application 외부로 이동 가능)
    copyButton: Button = new Button();
    cutButton: Button = new Button();
    pasteButton: Button = new Button();
    undoButton: Button = new Button();

    // Shortcuts (Application 외부로 이동 가능)
    shortcuts: Shortcuts = new Shortcuts();

    createUI() {
      const copy = () => {
        this.executeCommand(new CopyCommand(this, this.activeEditor));
      };
      this.copyButton.setCommand(copy);
      this.shortcuts.onKeyPress("Ctrl+C", copy);

      const cut = () => {
        this.executeCommand(new CutCommand(this, this.activeEditor));
      };
      this.cutButton.setCommand(cut);
      this.shortcuts.onKeyPress("Ctrl+X", cut);

      const paste = () => {
        this.executeCommand(new PasteCommand(this, this.activeEditor));
      };
      this.pasteButton.setCommand(paste);
      this.shortcuts.onKeyPress("Ctrl+V", paste);

      const undo = () => {
        this.executeCommand(new UndoCommand(this, this.activeEditor));
      };
      this.undoButton.setCommand(undo);
      this.shortcuts.onKeyPress("Ctrl+Z", undo);
    }

    executeCommand(command: Command) {
      this.history.push(command);
    }

    undo() {
      const command = this.history.pop();
      if (command != null) {
        command.undo();
      }
    }
  }
}
