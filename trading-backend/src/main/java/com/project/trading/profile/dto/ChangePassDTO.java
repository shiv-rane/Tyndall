package com.project.trading.profile.dto;

public class ChangePassDTO {

    private String current_pass;
    private String new_pass;
    private String confirm_password;

    public ChangePassDTO(String current_pass, String confirm_password, String new_pass) {
        this.current_pass = current_pass;
        this.confirm_password = confirm_password;
        this.new_pass = new_pass;
    }

    public String getCurrent_pass() {
        return current_pass;
    }

    public void setCurrent_pass(String current_pass) {
        this.current_pass = current_pass;
    }

    public String getNew_pass() {
        return new_pass;
    }

    public void setNew_pass(String new_pass) {
        this.new_pass = new_pass;
    }

    public String getConfirm_password() {
        return confirm_password;
    }

    public void setConfirm_password(String confirm_password) {
        this.confirm_password = confirm_password;
    }
}
