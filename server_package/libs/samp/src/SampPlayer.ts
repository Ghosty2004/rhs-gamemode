import {SampPlayerNativeFunctions} from "./SampPlayerNativeFunctions";
import {GetVehicleTrailer, GetVehicleVelocity, GetVehicleZAngle} from "./SampFunctions";
import {TextDraw, TextDrawConfig} from "./TextDraw";
import {TextDraws} from "./TextDraws";

export class SampPlayer extends SampPlayerNativeFunctions {
    state: any = {};

    constructor(playerid: number) {
        super(playerid);
    }

    public get vehicleId() {
        return this.GetPlayerVehicleID();
    }

    public get position() {
        const p = this.GetPlayerPos();
        const {vehicleId} = this;
        const angle = vehicleId !== 0 ? GetVehicleZAngle(vehicleId) : this.GetPlayerFacingAngle();
        return {
            x: p[0],
            y: p[1],
            z: p[2],
            angle,
            vehicleId
        };
    }

    public get trailerId() {
        const {vehicleId} = this;
        return vehicleId !== 0 ? GetVehicleTrailer(vehicleId) : 0;
    }

    public get speed() {
        const {vehicleId} = this;
        const speed = vehicleId !== 0 ? GetVehicleVelocity(vehicleId) : this.GetPlayerVelocity();
        return {
            x: speed[0],
            y: speed[1],
            z: speed[2]
        }
    }

    setState(newState: any) {
        this.state = {...this.state, ...newState};
    }

    TextDraw(config: TextDrawConfig, name: string) {
        return new TextDraw(this.playerid, config, name);
    }

    TextDrawShow(name: string) {
        TextDraws.getAll(this.playerid).filter(td => td.name === name).forEach(td => td.show());
    }

    TextDrawHide(name: string) {
        TextDraws.getAll(this.playerid).filter(td => td.name === name).forEach(td => td.hide());
    }

    TextDrawDestory(name: string) {
        TextDraws.destroy(this.playerid, name);
    }

    /** 
     * Custom Variables by @Ghosty2004
    */
    private variables: any = {};

    setVariable(name: string, value: any): void {
        if(!this.variables[`id${this.playerid}`]) this.variables[`id${this.playerid}`] = [];
        const index = this.variables[`id${this.playerid}`].findIndex(f => f.name == name);
        if(index == -1) {
            this.variables[`id${this.playerid}`].push({name: name, value: value});
        } else {
            this.variables[`id${this.playerid}`][index].value = value;
        }
    }

    setVariables(values: { [key: string]: any }): void {
        const array = Object.entries(values);
        array.forEach((value) => {
            this.setVariable(value[0], value[1]);
        });
    }
    
    getVariable(name: string): any {
        if(!this.variables[`id${this.playerid}`]) return null;
        const result = this.variables[`id${this.playerid}`].find(f => f.name == name);
        if(!result) return null;
        return result.value;
    }

    getVariables(): [{name: string, value: any}]|[] {
        if(!this.variables[`id${this.playerid}`]) return [];
        return this.variables[`id${this.playerid}`];
    }
}