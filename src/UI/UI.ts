import Unit from "../Entity/Unit";
import City from "../Entity/City";
import CityScreen from "./CityScreen";
import UnitScreen from "./UnitScreen";
import { Game } from "..";
import { IResources } from "../Util/GlobalInterfaces";
import { Civilization } from "../Civiliziations/Civilization";
import { Entity } from "../Entity/Entity";
import LoginScreen from "./LoginScreen";

export class UI {
  private uiitems = {
    actionLog: getElement("#action-log"),
    resources: {
      money: {
        container: getElement("#res-gold"),
        income: getElement("#res-gold-p"),
      },
      wood: {
        container: getElement("#res-wood"),
        income: getElement("#res-wood-p"),
      },
      stone: {
        container: getElement("#res-stone"),
        income: getElement("#res-stone-p"),
      },
      iron: {
        container: getElement("#res-iron"),
        income: getElement("#res-iron-p"),
      },
      horse: {
        container: getElement("#res-horse"),
        income: getElement("#res-horse-p"),
      },
      mineral: {
        container: getElement("#res-mineral"),
        income: getElement("#res-mineral-p"),
      },
    },
    turn: getElement("#res-turn"),

    gameContainer: getElement(".game-container")
  }
  private _turn = 1;
  private selectedEntity: Entity;

  private cityScreen = new CityScreen();
  private unitScreen = new UnitScreen();
  public loginScreen = new LoginScreen(this);

  constructor(public game: Game) {
    getElement(".actions-turn").onclick = () => {
      game.NextTurn();
    };
    this.uiitems.gameContainer.style.display = "none"
  }

  ShowUnit(unit: Unit) {
    this.unitScreen.Show(unit);
  }
  HideUnit() {
    this.unitScreen.Close();
  }
  ShowCity(city: City) {
    this.cityScreen.Show(city);
    this.UpdateResources(city.civ);
  }
  HideCity() {
    this.cityScreen.Close();
  }

  UpdateResources(civ: Civilization) {
    const income = civ.GetResourceIncome();
    const res = civ.resources;
    type key = keyof IResources;
    for (const k in income) {
      if (!this.uiitems.resources[k as key]) continue;
      //@ts-ignore
      this.uiitems.resources[k as key].container.textContent = res[k as key];

      //@ts-ignore
      const inc = Math.round(income[k]);
      //@ts-ignore
      this.uiitems.resources[k as key].income.textContent =
        //@ts-ignore
        "(" + (inc >= 0 ? "+" : "") + inc + ")";
    }
  }
  public NextTurn() {
    this.uiitems.turn.textContent = (++this._turn).toString();
    this.UpdateResources(this.game.mainCiv);
  }
  public HideEntity() {
    this.selectedEntity && this.selectedEntity.Deselect();
  }
  public appendToActionLog(text: string) {
    const al = this.uiitems.actionLog;
    const li = document.createElement("li");
    li.textContent = text;
    al.insertBefore(li, al.firstChild);
  }
}

export function getElement<T extends HTMLElement>(selector: string): T {
  const ele = document.querySelector(selector) as T;
  if (!ele) throw new Error("Could not find element with: " + selector);
  else return ele;
}

export interface IScreen {
  Show(entity: Entity): void;
  Close(): void;
}
