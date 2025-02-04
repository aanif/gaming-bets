<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportIsuuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('report_isuues', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->string('email');
            $table->text('description');
            $table->unsignedInteger('user_id');
            $table->enum("status", ['pending','in_process', 'resolved', 'canceled'])->default('pending');
            $table->text('file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('report_isuues');
    }
}
