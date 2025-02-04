<?php

namespace App\Jobs;

use App\Model\Match;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class MatchStartJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Match $match;
    public $tries = 3;

    /**
     * MatchStartJob constructor.
     * @param  Match  $match
     */
    public function __construct(Match $match)
    {
        $this->match = $match;
    }


    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // TODO: add dathost logic here before 30 min
    }
}
